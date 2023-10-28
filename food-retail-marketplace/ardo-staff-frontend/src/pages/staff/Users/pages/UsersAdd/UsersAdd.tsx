import React, {FC, useEffect, useMemo, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {Button, Card, Form, Input, Select} from "antd";
import {useForm, useWatch} from "antd/es/form/Form";
import {RouteNames} from "@pages//";
import {UserType} from "@entities/user/user";
import {txt} from "@shared/core/i18ngen";
import {rules} from "@shared/lib/form-rules/rules";
import {useActions} from "@shared/lib/hooks/useActions";
import {useTypedSelector} from "@shared/lib/hooks/useTypedSelector";
import {userTypeOptions, userTypeTranslate} from "@shared/lib/options/userTypeOptions";
import {AddUserReq} from "../../api/usersService";
import classes from "./UsersAdd.module.scss";

const initialFormValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    userType: UserType.CLIENT
}

export const UsersAdd: FC = () => {
    const navigate = useNavigate();
    const {user} = useTypedSelector(state => state.user);
    const {currentLang} = useTypedSelector(state => state.lang);
    const {isLoadingAddUser} = useTypedSelector(state => state.users);
    const {addUser} = useActions();
    const [form] = useForm();
    const values = useWatch([], form);

    const [submittable, setSubmittable] = useState(false);

    const userOptionsAccordingToUserAccess = useMemo(() => {
        const options = userTypeOptions.map(opt => ({...opt, label: userTypeTranslate(opt.label, currentLang)}));
        switch (user.userType) {
            case UserType.ADMIN:
                return options;
            default:
                return options.filter(opt => opt.value !== UserType.ADMIN && opt.value !== UserType.DEVELOPER);
        }
    }, [user.userType]);

    const handleSubmit = async () => {
        const values = form.getFieldsValue();
        const req: AddUserReq = {
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            password: values.password,
            userType: values.userType
        }
        await addUser(req, {navigate, to: RouteNames.USERS});
    }

    const handleCancel = () => {
        navigate(RouteNames.USERS);
    }

    useEffect(() => {
        form.validateFields({validateOnly: true}).then(
            () => setSubmittable(true),
            () => setSubmittable(false),
        );
    }, [values]);

    return (
        <div className={classes.main}>
            <Card bodyStyle={{padding: "20px 10px", borderRadius: "8px"}}>
                <Form form={form} layout={"vertical"} onFinish={handleSubmit} initialValues={initialFormValues}>
                    <div className={classes.form__row}>
                        <Form.Item
                            name={"firstName"}
                            label={txt.first_name[currentLang]}
                            className={classes.form__item}
                            rules={[rules.required(txt.please_enter_firstname[currentLang])]}
                        >
                            <Input placeholder={txt.enter_firstname[currentLang]}/>
                        </Form.Item>

                        <Form.Item
                            name={"lastName"}
                            label={txt.last_name[currentLang]}
                            className={classes.form__item}
                            rules={[rules.required(txt.please_enter_lastname[currentLang])]}
                        >
                            <Input placeholder={txt.enter_lastname[currentLang]}/>
                        </Form.Item>
                    </div>

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

                    <div className={classes.form__row}>
                        <Form.Item
                            name={"password"}
                            label={txt.password[currentLang]}
                            className={classes.form__item}
                            rules={[
                                rules.required(txt.please_enter_password[currentLang]),
                                rules.minmaxLen(txt.password_must_be_at_least_6_and_max_32_characters[currentLang], 6, 32)
                            ]}
                        >
                            <Input placeholder={txt.enter_password[currentLang]}/>
                        </Form.Item>

                        <Form.Item
                            name={"confirmPassword"}
                            label={txt.confirm_password[currentLang]}
                            className={classes.form__item}
                            rules={[
                                rules.required(txt.please_enter_confirm_password[currentLang]),
                                rules.matchPass(form, currentLang)
                            ]}
                        >
                            <Input placeholder={txt.enter_confirm_password[currentLang]}/>
                        </Form.Item>
                    </div>

                    <Form.Item style={{margin: "0"}}>
                        <div className={classes.form__btns}>
                            <Button onClick={handleCancel} type={"primary"} style={{margin: "0"}}>
                                {txt.back[currentLang]}
                            </Button>
                            <Button
                                loading={isLoadingAddUser}
                                disabled={isLoadingAddUser || !submittable}
                                type={"primary"}
                                htmlType={"submit"}
                                style={{margin: "0"}}
                            >
                                {txt.add[currentLang]}
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};
