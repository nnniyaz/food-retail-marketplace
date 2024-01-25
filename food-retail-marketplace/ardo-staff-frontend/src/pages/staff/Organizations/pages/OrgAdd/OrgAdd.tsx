import React, {FC, useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {Button, Card, Form, Input, Select} from "antd";
import {useForm, useWatch} from "antd/es/form/Form";
import {RouteNames} from "@pages/index";
import {AddOrganizationReq} from "@pages/staff/Organizations/api/organizationsService";
import {Currency} from "@entities/base/currency";
import {txt} from "@shared/core/i18ngen";
import {rules} from "@shared/lib/form-rules/rules";
import {useActions} from "@shared/lib/hooks/useActions";
import {useTypedSelector} from "@shared/lib/hooks/useTypedSelector";
import {currencyTranslate} from "@shared/lib/utils/currency-translate";
import classes from "./OrgAdd.module.scss";

const initialFormValues = {
    logo: "",
    name: "",
    currency: Currency.KZT,
    phone: "",
    email: "",
    address: "",
    desc: "",
}

export const OrgAdd: FC = () => {
    const navigate = useNavigate();
    const {currentLang} = useTypedSelector(state => state.lang);
    const {isLoadingAddOrganization} = useTypedSelector(state => state.organizations);
    const {addOrganization} = useActions();
    const [form] = useForm();
    const values = useWatch([], form);

    const [submittable, setSubmittable] = useState(false);

    const currencyOptions = [
        {value: Currency.HKD, label: currencyTranslate(Currency.HKD, currentLang, true)},
        {value: Currency.USD, label: currencyTranslate(Currency.USD, currentLang, true)},
        {value: Currency.KZT, label: currencyTranslate(Currency.KZT, currentLang, true)},
    ];

    const handleCancel = () => {
        navigate(RouteNames.ORGANIZATIONS);
    }

    const handleSubmit = async () => {
        const values = form.getFieldsValue();
        const req: AddOrganizationReq = {
            logo: values.logo,
            name: values.name,
            currency: values.currency,
            phone: values.phone,
            email: values.email,
            address: values.address,
            desc: values.desc || null,
        }
        await addOrganization(req, {navigate, to: RouteNames.ORGANIZATIONS});
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
                    <Form.Item
                        name={"name"}
                        label={txt.organization_name[currentLang]}
                        rules={[rules.required(txt.please_enter_organization_name[currentLang])]}
                    >
                        <Input placeholder={txt.enter_organization_name[currentLang]}/>
                    </Form.Item>

                    <Form.Item
                        name={"currency"}
                        label={txt.currency[currentLang]}
                        rules={[rules.required(txt.please_select_currency[currentLang])]}
                    >
                        <Select
                            placeholder={txt.select_currency[currentLang]}
                            options={currencyOptions}
                        />
                    </Form.Item>

                    <Form.Item
                        name={"phone"}
                        label={txt.phone[currentLang]}
                        rules={[rules.required(txt.please_enter_phone[currentLang])]}
                    >
                        <Input placeholder={`${txt.enter_phone[currentLang]}. Ex: +7 777 777 77 77`}/>
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
                        name={"address"}
                        label={txt.address[currentLang]}
                        rules={[rules.required(txt.please_enter_phone[currentLang])]}
                    >
                        <Input placeholder={txt.enter_address[currentLang]}/>
                    </Form.Item>

                    <Form.Item
                        name={"desc"}
                        label={txt.desc[currentLang]}
                    >
                        <Input placeholder={txt.enter_desc[currentLang]}/>
                    </Form.Item>

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
                                loading={isLoadingAddOrganization}
                                disabled={isLoadingAddOrganization || !submittable}
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
