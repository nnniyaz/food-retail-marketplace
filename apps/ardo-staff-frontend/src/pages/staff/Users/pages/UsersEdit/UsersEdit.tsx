import React, {FC, useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useForm, useWatch} from "antd/es/form/Form";
import {Button, Card, Form, Input, Select} from "antd";
import {isEmpty} from "lodash";
import {RouteNames} from "@pages/index";
import {UserType} from "@entities/user/user";
import {CountryCodeEnum, CountryCodes, Phone} from "@entities/base/phone";
import {txt} from "@shared/core/i18ngen";
import {back} from "@shared/lib/back/back";
import {rules} from "@shared/lib/form-rules/rules";
import {RowInfo} from "@shared/ui/RowInfo";
import {PhoneInput} from "@shared/ui/Input/PhoneInput";
import {dateFormat} from "@shared/lib/date/date-format";
import {useActions} from "@shared/lib/hooks/useActions";
import {langOptions} from "@shared/lib/options/langOptions";
import {phoneFormat} from "@shared/lib/phone/phoneFormat";
import {DeliveryPoint} from "@shared/ui/DeliveryPoint/DeliveryPoint";
import {useTypedSelector} from "@shared/lib/hooks/useTypedSelector";
import {userTypeOptions, userTypeTranslate} from "@shared/lib/options/userTypeOptions";
import classes from "./UsersEdit.module.scss";

export const UsersEdit: FC = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const {currentLang} = useTypedSelector(state => state.lang);
    const {
        userById,
        isLoadingGetUserById,
        isLoadingEditUserCredentials,
        isLoadingEditUserEmail,
        isLoadingEditUserPhone,
        isLoadingEditUserPreferredLang,
        isLoadingEditUserRole,
        isLoadingAddUserDeliveryPoint,
        isLoadingEditUserDeliveryPoint,
        isLoadingDeleteUserDeliveryPoint,
        isLoadingEditUserLastDeliveryPoint,
        isLoadingEditUserPassword,
        isLoadingDeleteUser,
        isLoadingRecoverUser
    } = useTypedSelector(state => state.users);
    const {
        getUserById,
        editUserCredentials,
        editUserEmail,
        editUserPhone,
        editUserPreferredLang,
        editUserRole,
        addUserDeliveryPoint,
        editUserDeliveryPoint,
        deleteUserDeliveryPoint,
        editUserLastDeliveryPoint,
        editUserPassword,
        deleteUser,
        recoverUser
    } = useActions();
    const [editMode, setEditMode] = useState(false);

    const [formCredentials] = useForm();
    const [formEmail] = useForm();
    const [formPhone] = useForm<{ phone: Phone }>();
    const [formPreferredLang] = useForm();
    const [formRole] = useForm();
    const [formAddDeliveryPoint] = useForm();
    const [formEditDeliveryPoint] = useForm();
    const [formDeleteDeliveryPoint] = useForm();
    const [formChangeLastDeliveryPoint] = useForm();
    const [formPassword] = useForm();

    const valuesCredentials = useWatch([], formCredentials);
    const valuesEmail = useWatch([], formEmail);
    const valuesPhone = useWatch([], formPhone);
    const valuesPreferredLang = useWatch([], formPreferredLang);
    const valuesRole = useWatch([], formRole);
    const valuesAddDeliveryPoint = useWatch([], formAddDeliveryPoint);
    const valuesEditDeliveryPoint = useWatch([], formEditDeliveryPoint);
    const valuesDeleteDeliveryPoint = useWatch([], formDeleteDeliveryPoint);
    const valuesChangeLastDeliveryPoint = useWatch([], formChangeLastDeliveryPoint);
    const valuesPassword = useWatch([], formPassword);

    const [formCredentialsInitialValues, setFormCredentialsInitialValues] = useState<{ firstName: string, lastName: string }>({
        firstName: "",
        lastName: ""
    });
    const [formEmailInitialValues, setFormEmailInitialValues] = useState<{ email: string }>({
        email: ""
    });
    const [formPhoneInitialValues, setFormPhoneInitialValues] = useState<{ phone: Phone }>({
        phone: {number: "", countryCode: CountryCodeEnum.HK}
    });
    const [formPasswordInitialValues] = useState<{ password: string }>({
        password: ""
    });
    const [formPreferredLangInitialValues, setFormPreferredLangInitialValues] = useState<{ preferredLang: string }>({
        preferredLang: ""
    });
    const [formRoleInitialValues, setFormRoleInitialValues] = useState<{ role: UserType }>({
        role: UserType.CLIENT
    });

    const [submittableCredentials, setSubmittableCredentials] = React.useState(false);
    const [submittableEmail, setSubmittableEmail] = React.useState(false);
    const [submittablePhone, setSubmittablePhone] = React.useState(false);
    const [submittablePreferredLang, setSubmittablePreferredLang] = React.useState(false);
    const [submittableRole, setSubmittableRole] = React.useState(false);
    const [submittableAddDeliveryPoint, setSubmittableAddDeliveryPoint] = React.useState(false);
    const [submittableEditDeliveryPoint, setSubmittableEditDeliveryPoint] = React.useState(false);
    const [submittableDeleteDeliveryPoint, setSubmittableDeleteDeliveryPoint] = React.useState(false);
    const [submittableEditLastDeliveryPoint, setSubmittableEditLastDeliveryPoint] = React.useState(false);
    const [submittableEditPassword, setSubmittableEditPassword] = React.useState(false);

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

    const handleResetCredentials = () => formCredentials.resetFields();
    const handleResetEmail = () => formEmail.resetFields();
    const handleResetPhone = () => formPhone.resetFields();
    const handleResetPreferredLang = () => formPreferredLang.resetFields();
    const handleResetRole = () => formRole.resetFields();
    const handleResetAddDeliveryPoint = () => formAddDeliveryPoint.resetFields();
    const handleResetEditDeliveryPoint = () => formEditDeliveryPoint.resetFields();
    const handleResetDeleteDeliveryPoint = () => formDeleteDeliveryPoint.resetFields();
    const handleResetChangeLastDeliveryPoint = () => formChangeLastDeliveryPoint.resetFields();
    const handleResetPassword = () => formPassword.resetFields();

    const handleUserCredentialsEdit = async () => {
        if (!id) {
            return;
        }
        await editUserCredentials(id, {
            firstName: formCredentials.getFieldValue("firstName"),
            lastName: formCredentials.getFieldValue("lastName"),
        }, {navigate});
    }
    const handleUserEmailEdit = async () => {
        if (!id) {
            return;
        }
        await editUserEmail(id, {
            email: formEmail.getFieldValue("email"),
        }, {navigate});
    }
    const handleUserPhoneEdit = async () => {
        if (!id) {
            return;
        }
        await editUserPhone(id, {
            phoneNumber: formEmail.getFieldValue("phone"),
            countryCode: formEmail.getFieldValue("phone"),
        }, {navigate});
    }
    const handleUserPreferredLangEdit = async () => {
        if (!id) {
            return;
        }
        await editUserPreferredLang(id, {
            preferredLang: formPreferredLang.getFieldValue("preferredLang"),
        }, {navigate});
    }
    const handleUserRoleEdit = async () => {
        if (!id) {
            return;
        }
        await editUserRole(id, {
            role: formRole.getFieldValue("role"),
        }, {navigate});
    }
    const handleAddUserDeliveryPoint = async () => {
        if (!id) {
            return;
        }
        await addUserDeliveryPoint(id, {
            address: formAddDeliveryPoint.getFieldValue("address"),
            floor: formAddDeliveryPoint.getFieldValue("floor"),
            apartment: formAddDeliveryPoint.getFieldValue("apartment"),
            deliveryComment: formAddDeliveryPoint.getFieldValue("deliveryComment"),
        }, {navigate});
    }
    const handleEditUserDeliveryPoint = async (pointId: string) => {
        if (!id) {
            return;
        }
        await editUserDeliveryPoint(id, {
            id: pointId,
            address: formEditDeliveryPoint.getFieldValue("address"),
            floor: formEditDeliveryPoint.getFieldValue("floor"),
            apartment: formEditDeliveryPoint.getFieldValue("apartment"),
            deliveryComment: formEditDeliveryPoint.getFieldValue("deliveryComment"),
        }, {navigate});
    }
    const handleDeleteUserDeliveryPoint = async (pointId: string) => {
        if (!id) {
            return;
        }
        await deleteUserDeliveryPoint(id, {deliveryPointId: pointId}, {navigate});
    }
    const handleEditUserLastDeliveryPoint = async (pointId: string) => {
        if (!id) {
            return;
        }
        await editUserLastDeliveryPoint(id, {deliveryPointId: pointId}, {navigate});
    }
    const handleEditUserPassword = async () => {
        if (!id) {
            return;
        }
        await editUserPassword(id, {
            password: formPassword.getFieldValue("password"),
        }, {navigate});
    }

    useEffect(() => {
        formCredentials.validateFields({validateOnly: true}).then(
            () => setSubmittableCredentials(userById?.firstName !== valuesCredentials?.firstName || userById?.lastName !== valuesCredentials?.lastName),
            () => setSubmittableCredentials(false)
        )
        formEmail.validateFields({validateOnly: true}).then(
            () => setSubmittableEmail(userById?.email !== valuesEmail?.email),
            () => setSubmittableEmail(false)
        )
        formPhone.validateFields({validateOnly: true}).then(
            () => setSubmittablePhone(userById?.phone?.number !== valuesPhone?.phone?.number || userById?.phone?.countryCode !== valuesPhone?.phone?.countryCode),
            () => setSubmittablePhone(false)
        )
        formPreferredLang.validateFields({validateOnly: true}).then(
            () => setSubmittablePreferredLang(userById?.preferredLang !== valuesPreferredLang?.preferredLang),
            () => setSubmittablePreferredLang(false)
        )
        formRole.validateFields({validateOnly: true}).then(
            () => setSubmittableRole(userById?.userType !== valuesRole?.role),
            () => setSubmittableRole(false)
        )
        formAddDeliveryPoint.validateFields({validateOnly: true}).then(
            () => setSubmittableAddDeliveryPoint(true),
            () => setSubmittableAddDeliveryPoint(false)
        )
        formEditDeliveryPoint.validateFields({validateOnly: true}).then(
            () => setSubmittableEditDeliveryPoint(true),
            () => setSubmittableEditDeliveryPoint(false)
        )
        formDeleteDeliveryPoint.validateFields({validateOnly: true}).then(
            () => setSubmittableDeleteDeliveryPoint(true),
            () => setSubmittableDeleteDeliveryPoint(false)
        )
        formChangeLastDeliveryPoint.validateFields({validateOnly: true}).then(
            () => setSubmittableEditLastDeliveryPoint(true),
            () => setSubmittableEditLastDeliveryPoint(false)
        )
        formPassword.validateFields({validateOnly: true}).then(
            () => setSubmittableEditPassword(!!valuesPassword?.password && !!valuesPassword?.passwordConfirm),
            () => setSubmittableEditPassword(false)
        )
    }, [
        userById,
        formCredentials, formEmail, formPhone, formPreferredLang, formRole, formAddDeliveryPoint, formEditDeliveryPoint, formDeleteDeliveryPoint, formChangeLastDeliveryPoint, formPassword,
        valuesCredentials, valuesEmail, valuesPhone, valuesPreferredLang, valuesRole, valuesAddDeliveryPoint, valuesEditDeliveryPoint, valuesDeleteDeliveryPoint, valuesChangeLastDeliveryPoint, valuesPassword
    ]);

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
        setFormCredentialsInitialValues({
            firstName: userById?.firstName || "",
            lastName: userById?.lastName || ""
        });
        setFormEmailInitialValues({
            email: userById?.email || ""
        });
        setFormPhoneInitialValues({
            phone: isEmpty(userById?.phone) ? {countryCode: CountryCodeEnum.HK, number: ""} : userById?.phone
        });
        setFormPreferredLangInitialValues({
            preferredLang: userById?.preferredLang || ""
        });
        setFormRoleInitialValues({
            role: userById?.userType || UserType.CLIENT
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
                <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
                    <Button onClick={() => setEditMode(false)} style={{width: "100px"}}>
                        {txt.cancel[currentLang]}
                    </Button>
                    <Card bodyStyle={{padding: "10px", borderRadius: "8px"}} loading={isLoadingGetUserById}>
                        <RowInfo label={txt.id[currentLang]} value={userById?.id || "-"}/>
                        <RowInfo label={txt.code[currentLang]} value={userById?.code || "-"}/>
                        <RowInfo label={txt.created_at[currentLang]} value={dateFormat(userById?.createdAt || "") || "-"}/>
                        <RowInfo label={txt.updated_at[currentLang]} value={dateFormat(userById?.updatedAt || "") || "-"}/>
                        <RowInfo label={txt.version[currentLang]} value={userById?.version || "-"}/>
                    </Card>

                    <Card bodyStyle={{padding: "10px", borderRadius: "8px"}} loading={isLoadingEditUserCredentials}>
                        <Form
                            form={formCredentials}
                            onFinish={handleUserCredentialsEdit}
                            layout={"vertical"}
                            initialValues={formCredentialsInitialValues}
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

                            <Form.Item style={{marginBottom: "0"}}>
                                <div className={classes.row__btns} style={{marginTop: "0"}}>
                                    <Button onClick={handleResetCredentials}>
                                        {txt.reset[currentLang]}
                                    </Button>
                                    <Button
                                        loading={isLoadingEditUserCredentials}
                                        disabled={isLoadingEditUserCredentials || !submittableCredentials}
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

                    <Card bodyStyle={{padding: "10px", borderRadius: "8px"}} loading={isLoadingEditUserEmail}>
                        <Form
                            form={formEmail}
                            onFinish={handleUserEmailEdit}
                            layout={"vertical"}
                            initialValues={formEmailInitialValues}
                        >
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

                            <Form.Item style={{marginBottom: "0"}}>
                                <div className={classes.row__btns} style={{marginTop: "0"}}>
                                    <Button onClick={handleResetEmail}>
                                        {txt.reset[currentLang]}
                                    </Button>
                                    <Button
                                        loading={isLoadingEditUserEmail}
                                        disabled={isLoadingEditUserEmail || !submittableEmail}
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

                    <Card bodyStyle={{padding: "10px", borderRadius: "8px"}} loading={isLoadingEditUserPhone}>
                        <Form
                            form={formPhone}
                            onFinish={handleUserPhoneEdit}
                            layout={"vertical"}
                            initialValues={formPhoneInitialValues}
                        >
                            <Form.Item
                                name={"phone"}
                                label={txt.phone[currentLang]}
                                rules={[
                                    rules.required(txt.please_enter_phone[currentLang]),
                                    rules.phone(formPhone, currentLang)
                                ]}
                            >
                                <PhoneInput
                                    value={formPhone.getFieldValue("phone")}
                                    onChange={(value: Phone) => formPhone.setFieldValue("phone", value)}
                                />
                            </Form.Item>

                            <Form.Item style={{marginBottom: "0"}}>
                                <div className={classes.row__btns} style={{marginTop: "0"}}>
                                    <Button onClick={handleResetPhone}>
                                        {txt.reset[currentLang]}
                                    </Button>
                                    <Button
                                        loading={isLoadingEditUserPhone}
                                        disabled={isLoadingEditUserPhone || !submittablePhone}
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

                    <Card bodyStyle={{padding: "10px", borderRadius: "8px"}} loading={isLoadingEditUserPassword}>
                        <Form
                            form={formPassword}
                            onFinish={handleEditUserPassword}
                            layout={"vertical"}
                            initialValues={formPasswordInitialValues}
                        >
                            <Form.Item
                                name={"password"}
                                label={txt.password[currentLang]}
                                rules={[
                                    rules.required(txt.please_enter_password[currentLang]),
                                    rules.minmaxLen(txt.password_must_be_at_least_6_and_max_32_characters[currentLang], 6, 32)
                                ]}
                            >
                                <Input placeholder={txt.enter_password[currentLang]}/>
                            </Form.Item>

                            <Form.Item
                                name={"passwordConfirm"}
                                label={txt.confirm_password[currentLang]}
                                rules={[
                                    rules.required(txt.please_enter_confirm_password[currentLang]),
                                    rules.matchPass(formPassword, currentLang)
                                ]}
                            >
                                <Input placeholder={txt.enter_password[currentLang]}/>
                            </Form.Item>

                            <Form.Item style={{marginBottom: "0"}}>
                                <div className={classes.row__btns} style={{marginTop: "0"}}>
                                    <Button onClick={handleResetPassword}>
                                        {txt.reset[currentLang]}
                                    </Button>
                                    <Button
                                        loading={isLoadingEditUserPassword}
                                        disabled={isLoadingEditUserPassword || !submittableEditPassword}
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

                    <Card bodyStyle={{padding: "10px", borderRadius: "8px"}} loading={isLoadingEditUserPreferredLang}>
                        <Form
                            form={formPreferredLang}
                            onFinish={handleUserPreferredLangEdit}
                            layout={"vertical"}
                            initialValues={formPreferredLangInitialValues}
                        >
                            <Form.Item
                                name={"preferredLang"}
                                label={txt.preferred_lang[currentLang]}
                                rules={[rules.required(txt.please_select_preferred_lang[currentLang])]}
                            >
                                <Select placeholder={txt.select_preferred_lang[currentLang]} options={langOptions}/>
                            </Form.Item>

                            <Form.Item style={{marginBottom: "0"}}>
                                <div className={classes.row__btns} style={{marginTop: "0"}}>
                                    <Button onClick={handleResetPreferredLang}>
                                        {txt.reset[currentLang]}
                                    </Button>
                                    <Button
                                        loading={isLoadingEditUserPreferredLang}
                                        disabled={isLoadingEditUserPreferredLang || !submittablePreferredLang}
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

                    <Card bodyStyle={{padding: "10px", borderRadius: "8px"}} loading={isLoadingEditUserRole}>
                        <Form
                            form={formRole}
                            onFinish={handleUserRoleEdit}
                            layout={"vertical"}
                            initialValues={formRoleInitialValues}
                        >
                            <Form.Item
                                name={"role"}
                                label={txt.user_type[currentLang]}
                                rules={[rules.required(txt.please_select_usertype[currentLang])]}
                            >
                                <Select
                                    placeholder={txt.select_usertype[currentLang]}
                                    options={userTypeOptions.map(opt => ({
                                        ...opt,
                                        label: userTypeTranslate(opt.label, currentLang)})
                                    )}
                                />
                            </Form.Item>

                            <Form.Item style={{marginBottom: "0"}}>
                                <div className={classes.row__btns} style={{marginTop: "0"}}>
                                    <Button onClick={handleResetRole}>
                                        {txt.reset[currentLang]}
                                    </Button>
                                    <Button
                                        loading={isLoadingEditUserRole}
                                        disabled={isLoadingEditUserRole || !submittableRole}
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
                </div>
            ) : (
                <Card bodyStyle={{padding: "10px", borderRadius: "8px"}} loading={isLoadingGetUserById}>
                    <h1 className={classes.title}>{`${userById?.firstName} ${userById?.lastName || ""}`}</h1>
                    <h3 className={classes.subtitle}>{userById?.id || "-"}</h3>
                    <RowInfo
                        label={txt.code[currentLang]}
                        value={userById?.code || "-"}
                    />
                    <RowInfo
                        label={txt.email[currentLang]}
                        value={userById?.email || "-"}
                    />
                    <RowInfo
                        label={txt.phone[currentLang]}
                        value={
                            (userById?.phone?.countryCode && userById?.phone?.number)
                                ? `${CountryCodes[userById?.phone.countryCode].dialCode} ${phoneFormat(userById?.phone.number, userById?.phone.countryCode)}`
                                : "-"
                        }
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
                    <RowInfo
                        label={txt.version[currentLang]}
                        value={userById?.version || "-"}
                    />
                    <RowInfo
                        layout={"vertical"}
                        label={`${txt.current_delivery_point[currentLang]}:`}
                        value={
                            !isEmpty(userById?.lastDeliveryPoint) ? (
                                <DeliveryPoint {...(userById!.lastDeliveryPoint)}/>
                            ) : (
                                <RowInfo label={txt.no_delivery_point[currentLang]}/>
                            )
                        }
                    />

                    <RowInfo
                        layout={"vertical"}
                        label={`${txt.delivery_points[currentLang]}:`}
                        value={
                            <div style={{width: "100%", display: "flex", flexWrap: "wrap", gap: "10px"}}>
                                {
                                    !!userById?.deliveryPoints?.length
                                        ? (
                                            userById?.deliveryPoints?.map((point, index) => (
                                                <DeliveryPoint key={index} {...point}/>
                                            ))
                                        ) : (
                                            <RowInfo label={txt.no_delivery_point[currentLang]}/>
                                        )
                                }
                            </div>
                        }
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
