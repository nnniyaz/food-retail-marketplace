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
    return (
        <Modal
            open={props.isOpen}
            onCancel={() => props.setIsOpen(false)}
        >
            <Form form={form} action={"/api/applications"} method={"POST"}>
                <Form.Item
                    name={"firstName"}
                    required
                    rules={[rules.required(translate("please_enter_first_name", props.lang))]}
                >
                    <Input placeholder={translate("enter_first_name", props.lang)}/>
                </Form.Item>
                <Form.Item
                    name={"lastName"}
                    required
                    rules={[rules.required(translate("please_enter_last_name", props.lang))]}
                >
                    <Input placeholder={translate("enter_last_name", props.lang)}/>
                </Form.Item>
                <Form.Item
                    name={"email"}
                    required
                    rules={[
                        rules.required(translate("please_enter_email", props.lang)),
                        rules.email(translate("please_enter_valid_email", props.lang))
                    ]}
                >
                    <Input type={"email"} placeholder={translate("enter_email", props.lang)}/>
                </Form.Item>
                <Form.Item
                    name={"phone"}
                    required
                    rules={[
                        rules.required(translate("please_enter_phone", props.lang)),
                        rules.phone(translate("please_enter_valid_phone", props.lang))
                    ]}
                >
                    <Input type={"tel"} placeholder={translate("enter_phone", props.lang)}/>
                </Form.Item>
                <Form.Item
                    name={"businessName"}
                    required
                    rules={[rules.required(translate("please_enter_your_business_name", props.lang))]}
                >
                    <Input placeholder={translate("enter_your_business_name", props.lang)}/>
                </Form.Item>
                <Form.Item>
                    <Button htmlType={"submit"}>Submit</Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}
