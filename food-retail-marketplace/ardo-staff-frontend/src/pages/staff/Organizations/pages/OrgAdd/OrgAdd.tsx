import React, {FC} from 'react';
import {Card, Form, Input, Select, Upload} from "antd";
import {useForm} from "antd/es/form/Form";
import {PlusOutlined} from "@ant-design/icons";
import {Currency} from "@entities/base/currency";
import {txt} from "@shared/core/i18ngen";
import {rules} from "@shared/lib/form-rules/rules";
import {useActions} from "@shared/lib/hooks/useActions";
import {useTypedSelector} from "@shared/lib/hooks/useTypedSelector";
import {currencyTranslate} from "@shared/lib/utils/currency-translate";
import classes from "./OrgAdd.module.scss";
import {HttpStatusCode} from "axios";
import {ApiRoutes} from "../../../../../shared/api/api-routes";

const initialFormValues = {
    logo: "",
    name: "",
    currency: Currency.KZT,
    phone: "",
    email: "",
    address: "",
    desc: "",
}

const normFile = (e: any) => {
    if (Array.isArray(e)) {
        return e;
    }
    return e?.fileList;
};

export const OrgAdd: FC = () => {
    const {currentLang} = useTypedSelector(state => state.lang);
    const {} = useActions();
    const [form] = useForm();

    const currencyOptions = [
        {value: Currency.HKD, label: currencyTranslate(Currency.HKD, currentLang, true)},
        {value: Currency.USD, label: currencyTranslate(Currency.USD, currentLang, true)},
        {value: Currency.KZT, label: currencyTranslate(Currency.KZT, currentLang, true)},
    ];

    const handleSubmit = () => {

    }

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
                    >
                        <Input placeholder={txt.enter_address[currentLang]}/>
                    </Form.Item>

                    <Form.Item
                        name={"desc"}
                        label={txt.desc[currentLang]}
                    >
                        <Input placeholder={txt.enter_desc[currentLang]}/>
                    </Form.Item>

                    <Form.Item
                        // name={"logo"}
                        label={txt.logo[currentLang]}
                        valuePropName="file"
                        getValueFromEvent={normFile}
                    >
                        <Upload
                            listType={"picture-card"}
                            multiple={false}
                            onChange={(e) => console.log(e)}
                            method={"post"}
                            action={process.env.VITE_API_URL + ApiRoutes.POST_UPLOAD}
                        >
                            <div style={{backgroundColor: "transparent"}}>
                                <PlusOutlined/>
                                <div style={{marginTop: 8}}>Upload</div>
                            </div>
                        </Upload>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};
