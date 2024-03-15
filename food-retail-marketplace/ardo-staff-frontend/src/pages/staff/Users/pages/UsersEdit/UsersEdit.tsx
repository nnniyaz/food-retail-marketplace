import React, {FC, useEffect, useMemo, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useForm, useWatch} from "antd/es/form/Form";
import {Button, Card, Form, Input, Select} from "antd";
import {isEmpty} from "lodash";
import {RouteNames} from "@pages//";
import {UserType} from "@entities/user/user";
import {txt} from "@shared/core/i18ngen";
import {back} from "@shared/lib/back/back";
import {rules} from "@shared/lib/form-rules/rules";
import {RowInfo} from "@shared/ui/RowInfo";
import {useActions} from "@shared/lib/hooks/useActions";
import {dateFormat} from "@shared/lib/date/date-format";
import {langOptions} from "@shared/lib/options/langOptions";
import {useTypedSelector} from "@shared/lib/hooks/useTypedSelector";
import {userTypeOptions, userTypeTranslate} from "@shared/lib/options/userTypeOptions";
import classes from "./UsersEdit.module.scss";

export const UsersEdit: FC = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const {user} = useTypedSelector(state => state.user);
    const {currentLang} = useTypedSelector(state => state.lang);
    const {
        userById,
        isLoadingGetUserById,
        isLoadingEditUser,
        isLoadingDeleteUser,
        isLoadingRecoverUser
    } = useTypedSelector(state => state.users);
    const {
        getUserById,
        editUserCredentials,
        editUserEmail,
        editUserPreferredLang,
        deleteUser,
        recoverUser
    } = useActions();
    const [form] = useForm();
    const values = useWatch([], form);

    const [editMode, setEditMode] = useState(false);
    const [formInitialValues, setFormInitialValues] = useState({});
    const [submittable, setSubmittable] = React.useState(false);

    const userOptionsAccordingToUserAccess = useMemo(() => {
        const options = userTypeOptions.map(opt => ({...opt, label: userTypeTranslate(opt.label, currentLang)}));
        switch (user.userType) {
            case UserType.ADMIN:
                return options;
            default:
                return options.filter(opt => opt.value !== UserType.ADMIN);
        }
    }, [user.userType]);

    const handleCancel = () => {
        back(RouteNames.USERS, navigate);
    }

    const handleDelete = async () => {
        if (!id) {
            return;
        }
        await deleteUser(id, {navigate, to: RouteNames.USERS});
    }

    const handleRecovers = async () => {
        if (!id) {
            return;
        }
        await recoverUser(id, {navigate, to: RouteNames.USERS});
    }

    const handleReset = () => {
        form.resetFields();
    }

    const handleEdit = async () => {
        if (!id) {
            return;
        }
        await editUserCredentials(id, {
            firstName: form.getFieldValue("firstName"),
            lastName: form.getFieldValue("lastName"),
        }, {navigate});
        await editUserEmail(id, {
            email: form.getFieldValue("email"),
        }, {navigate});
        await editUserPreferredLang(id, {
            preferredLang: form.getFieldValue("preferredLang"),
        }, {navigate, to: RouteNames.USERS});
        setEditMode(false);
    }

    useEffect(() => {
        form.validateFields({validateOnly: true}).then(
            () => setSubmittable(true),
            () => setSubmittable(false),
        );
    }, [values]);

    useEffect(() => {
        if (!id) {
            return;
        }
        const controller = new AbortController();
        getUserById(id, controller, {navigate});
        return () => controller.abort();
    }, [id]);

    useEffect(() => {
        if (isEmpty(userById)) {
            return;
        }
        setFormInitialValues({
            firstName: userById?.firstName || "",
            lastName: userById?.lastName || "",
            email: userById?.email || "",
            userType: userById?.userType || "",
            preferredLang: userById?.preferredLang
        });
    }, [userById]);

    useEffect(() => {
        if (!id) {
            navigate(RouteNames.USERS);
        }
    }, []);

    return (
        <div className={classes.main}>
            {editMode ? (
                <Card bodyStyle={{padding: "10px", borderRadius: "8px"}} loading={isLoadingGetUserById}>
                    <RowInfo label={txt.id[currentLang]} value={userById?.id || "-"}/>
                    <RowInfo label={txt.created_at[currentLang]} value={dateFormat(userById?.createdAt || "") || "-"}/>
                    <RowInfo label={txt.updated_at[currentLang]} value={dateFormat(userById?.updatedAt || "") || "-"}/>

                    <Form
                        form={form}
                        onFinish={handleEdit}
                        layout={"vertical"}
                        style={{marginTop: "20px"}}
                        initialValues={formInitialValues}
                    >
                        <Form.Item
                            name={"firstName"}
                            label={txt.first_name[currentLang]}
                            rules={[rules.required(txt.please_enter_firstname[currentLang])]}
                        >
                            <Input placeholder={txt.enter_firstname[currentLang]}/>
                        </Form.Item>

                        <Form.Item
                            name={"lastName"}
                            label={txt.last_name[currentLang]}
                            rules={[rules.required(txt.please_enter_lastname[currentLang])]}
                        >
                            <Input placeholder={txt.enter_lastname[currentLang]}/>
                        </Form.Item>

                        <Form.Item
                            name={"email"}
                            label={txt.email[currentLang]}
                            rules={[
                                rules.required(txt.please_enter_email[currentLang]),
                                rules.email(txt.please_enter_valid_email[currentLang])
                            ]}
                        >
                            <Input placeholder={txt.enter_email[currentLang]}/>
                        </Form.Item>

                        <Form.Item
                            name={"userType"}
                            label={txt.user_type[currentLang]}
                            rules={[rules.required(txt.please_select_usertype[currentLang])]}
                        >
                            <Select
                                placeholder={txt.select_usertype[currentLang]}
                                options={userOptionsAccordingToUserAccess}
                            />
                        </Form.Item>

                        <Form.Item
                            name={"preferredLang"}
                            label={txt.preferred_lang[currentLang]}
                            rules={[rules.required(txt.please_select_preferred_lang[currentLang])]}
                        >
                            <Select placeholder={txt.select_preferred_lang[currentLang]} options={langOptions}/>
                        </Form.Item>

                        <Form.Item style={{marginBottom: "0"}}>
                            <div className={classes.row__btns} style={{marginTop: "0"}}>
                                <Button onClick={() => setEditMode(false)}>
                                    {txt.cancel[currentLang]}
                                </Button>
                                <Button onClick={handleReset}>
                                    {txt.reset[currentLang]}
                                </Button>
                                <Button
                                    loading={isLoadingEditUser}
                                    disabled={isLoadingEditUser || !submittable}
                                    type={"primary"}
                                    htmlType={"submit"}
                                    style={{margin: "0"}}
                                    className={classes.btn}
                                >
                                    {txt.edit[currentLang]}
                                </Button>
                            </div>
                        </Form.Item>
                    </Form>
                </Card>
            ) : (
                <Card bodyStyle={{padding: "10px", borderRadius: "8px"}} loading={isLoadingGetUserById}>
                    <h1 className={classes.title}>{`${userById?.firstName} ${userById?.lastName || ""}`}</h1>
                    <h3 className={classes.subtitle}>{userById?.id || "-"}</h3>
                    <RowInfo
                        label={txt.email[currentLang]}
                        value={userById?.email || "-"}
                    />
                    <RowInfo
                        label={txt.user_type[currentLang]}
                        value={userTypeTranslate(userById?.userType, currentLang) || "-"}
                    />
                    <RowInfo
                        label={txt.preferred_lang[currentLang]}
                        value={userById?.preferredLang || "-"}
                    />
                    <RowInfo
                        label={txt.created_at[currentLang]}
                        value={dateFormat(userById?.createdAt || "") || "-"}
                    />
                    <RowInfo
                        label={txt.updated_at[currentLang]}
                        value={dateFormat(userById?.updatedAt || "") || "-"}
                    />

                    <div className={classes.row__btns}>
                        <Button onClick={handleCancel}>
                            {txt.back[currentLang]}
                        </Button>
                        <Button
                            onClick={userById?.isDeleted ? handleRecovers : handleDelete}
                            loading={isLoadingDeleteUser || isLoadingRecoverUser}
                            danger={!userById?.isDeleted}
                            type={"primary"}
                        >
                            {userById?.isDeleted ? txt.recover[currentLang] : txt.delete[currentLang]}
                        </Button>
                        <Button onClick={() => setEditMode(true)} type={"primary"}>
                            {txt.edit[currentLang]}
                        </Button>
                    </div>
                </Card>
            )}
        </div>
    );
};
