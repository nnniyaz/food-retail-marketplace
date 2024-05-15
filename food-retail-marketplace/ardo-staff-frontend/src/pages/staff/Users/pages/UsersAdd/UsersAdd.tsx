import React, {FC, useEffect, useMemo, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useForm, useWatch} from "antd/es/form/Form";
import {Button, Card, Form, Input, Select} from "antd";
import {RouteNames} from "@pages//";
import {Langs} from "@entities/base/MlString";
import {UserType} from "@entities/user/user";
import {CountryCodeEnum, Phone} from "@entities/base/phone";
import {txt} from "@shared/core/i18ngen";
import {rules} from "@shared/lib/form-rules/rules";
import {PhoneInput} from "@shared/ui/Input/PhoneInput";
import {useActions} from "@shared/lib/hooks/useActions";
import {langOptions} from "@shared/lib/options/langOptions";
import {useTypedSelector} from "@shared/lib/hooks/useTypedSelector";
import {userTypeOptions, userTypeTranslate} from "@shared/lib/options/userTypeOptions";
import classes from "./UsersAdd.module.scss";

const initialFormValues = {
    firstName: "",
    lastName: "",
    email: "",
    phone: {
        countryCode: CountryCodeEnum.HK,
        number: ""
    },
    password: "",
    userType: UserType.CLIENT,
    preferredLang: Langs.EN,
    address: "",
    floor: "",
    apartment: "",
    deliveryComment: "",
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
                return options.filter(opt => opt.value !== UserType.ADMIN);
        }
    }, [user.userType]);

    const handleCancel = () => {
        navigate(RouteNames.USERS);
    }

    const handleSubmit = async () => {
        const values = form.getFieldsValue();
        await addUser({
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            phone: values.phone,
            password: values.password,
            userType: values.userType,
            preferredLang: values.preferredLang,
            address: values.address,
            floor: values.floor,
            apartment: values.apartment,
            deliveryComment: values.deliveryComment
        }, {navigate, to: RouteNames.USERS});
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

                    <div className={classes.form__row}>
                        <Form.Item
                            name={"email"}
                            label={txt.email[currentLang]}
                            className={classes.form__item}
                            rules={[
                                rules.required(txt.please_enter_email[currentLang]),
                                rules.email(txt.please_enter_valid_email[currentLang])
                            ]}
                        >
                            <Input placeholder={txt.enter_email[currentLang]}/>
                        </Form.Item>

                        <Form.Item
                            name={"phone"}
                            label={txt.phone[currentLang]}
                            className={classes.form__item}
                            rules={[
                                rules.required(txt.please_enter_phone[currentLang]),
                                rules.phone(form, currentLang)
                            ]}
                        >
                            <PhoneInput
                                value={form.getFieldValue("phone")}
                                onChange={(value: Phone) => form.setFieldValue("phone", value)}
                            />
                        </Form.Item>
                    </div>

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

                    <div className={classes.form__row}>
                        <Form.Item
                            name={"address"}
                            label={txt.address[currentLang]}
                            className={classes.form__item}
                            rules={[
                                rules.required(txt.please_enter_address[currentLang]),
                            ]}
                        >
                            <Input placeholder={txt.enter_address[currentLang]}/>
                        </Form.Item>

                        <Form.Item
                            name={"floor"}
                            label={txt.floor[currentLang]}
                            className={classes.form__item}
                            rules={[
                                rules.required(txt.please_enter_floor[currentLang]),
                            ]}
                        >
                            <Input placeholder={txt.enter_floor[currentLang]}/>
                        </Form.Item>
                    </div>

                    <div className={classes.form__row}>
                        <Form.Item
                            name={"apartment"}
                            label={txt.apartment[currentLang]}
                            className={classes.form__item}
                            rules={[
                                rules.required(txt.please_enter_apartment[currentLang]),
                            ]}
                        >
                            <Input placeholder={txt.enter_apartment[currentLang]}/>
                        </Form.Item>

                        <Form.Item
                            name={"deliveryComment"}
                            label={txt.delivery_comment[currentLang]}
                            className={classes.form__item}
                        >
                            <Input placeholder={txt.enter_delivery_comment[currentLang]}/>
                        </Form.Item>
                    </div>

                    <Form.Item style={{margin: "0"}}>
                        <div className={classes.form__btns}>
                            <Button
                                onClick={handleCancel}
                                type={"primary"}
                                style={{margin: "0"}}
                            >
                                {txt.back[currentLang]}
                            </Button>
                            <Button
                                loading={isLoadingAddUser}
                                disabled={isLoadingAddUser || !submittable}
                                type={"primary"}
                                htmlType={"submit"}
                                style={{margin: "0"}}
                                className={classes.btn}
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
