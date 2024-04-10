"use client";

import {Button, Form, Input, Modal} from "antd";
import {rules} from "@/pkg/form-rules/rules";
import {translate} from "@/pkg/translate/translate";
import {Langs} from "@/domain/mlString/mlString";

interface FormProps {
    lang: Langs;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export default function FormModal(props: FormProps) {
    const [form] = Form.useForm();

    const onSubmit = async (values: any) => {
        try {
            await fetch("/api/applications", {
                method: "POST",
                body: JSON.stringify(values),
                headers: {
                    "Content-Type": "application/json",
                    "Accept-Language": props.lang
                }
            });
            form.resetFields();
            props.setIsOpen(false);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Modal
            title={translate("fill_form", props.lang)}
            open={props.isOpen}
            onOk={() => form.submit()}
            onCancel={() => props.setIsOpen(false)}
            okText={translate("submit", props.lang)}
            cancelText={translate("cancel", props.lang)}
        >
            <Form
                form={form}
                action={"/api/applications"}
                method={"POST"}
                onFinish={onSubmit}
                layout={"vertical"}
            >
                <Form.Item
                    name={"firstName"}
                    label={translate("first_name", props.lang)}
                    required
                    rules={[rules.required(translate("please_enter_first_name", props.lang))]}
                >
                    <Input
                        placeholder={translate("enter_first_name", props.lang)}
                        autoComplete={"given-name"}
                    />
                </Form.Item>
                <Form.Item
                    name={"lastName"}
                    label={translate("last_name", props.lang)}
                    required
                    rules={[rules.required(translate("please_enter_last_name", props.lang))]}
                >
                    <Input
                        placeholder={translate("enter_last_name", props.lang)}
                        autoComplete={"family-name"}
                    />
                </Form.Item>
                <Form.Item
                    name={"email"}
                    label={translate("email", props.lang)}
                    required
                    rules={[
                        rules.required(translate("please_enter_email", props.lang)),
                        rules.email(translate("please_enter_valid_email", props.lang))
                    ]}
                >
                    <Input
                        type={"email"}
                        placeholder={translate("enter_email", props.lang)}
                        autoComplete={"email"}
                    />
                </Form.Item>
                <Form.Item
                    name={"phone"}
                    label={translate("phone", props.lang)}
                    required
                    rules={[
                        rules.required(translate("please_enter_phone", props.lang)),
                        rules.phone(translate("please_enter_valid_phone", props.lang))
                    ]}
                >
                    <Input
                        type={"tel"}
                        placeholder={translate("enter_phone", props.lang)}
                        autoComplete={"tel"}
                        prefix={"+852"}
                        maxLength={8}
                    />
                </Form.Item>
                <Form.Item
                    name={"businessName"}
                    label={translate("business_name", props.lang)}
                    required
                    rules={[rules.required(translate("please_enter_your_business_name", props.lang))]}
                >
                    <Input
                        placeholder={translate("enter_your_business_name", props.lang)}
                        autoComplete={"organization"}
                    />
                </Form.Item>
            </Form>
        </Modal>
    )
}
