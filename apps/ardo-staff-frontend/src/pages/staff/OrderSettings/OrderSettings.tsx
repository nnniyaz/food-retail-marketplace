import {Button, Card, Form} from "antd";
import React, {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {useForm, useWatch} from "antd/es/form/Form";
import {useActions} from "@shared/lib/hooks/useActions";
import {useTypedSelector} from "@shared/lib/hooks/useTypedSelector";
import {txt} from "@shared/core/i18ngen";
import {rules} from "@shared/lib/form-rules/rules";
import {NumberInput} from "@shared/ui/Input/NumberInput";
import classes from "./OrderSettings.module.scss";

export const OrderSettings = () => {
    const navigate = useNavigate();
    const {currentLang} = useTypedSelector(state => state.lang);
    const {
        orderSettings,
        isLoadingGetOrderSettings,
        isLoadingUpdateMoqFee
    } = useTypedSelector(state => state.orderSettings);
    const {getOrderSettings, updateOrderSettingsMoqFee} = useActions();
    const [form] = useForm();
    const values = useWatch([], form);

    const handleMoqFeeUpdate = async () => {
        await updateOrderSettingsMoqFee(values.fee, values.freeFrom, {navigate});
    }

    useEffect(() => {
        if (orderSettings) {
            form.setFieldsValue({
                fee: orderSettings.moq.fee,
                freeFrom: orderSettings.moq.freeFrom,
            });
        }
    }, [orderSettings]);

    useEffect(() => {
        const controller = new AbortController();
        getOrderSettings(controller, {navigate});
        return () => controller.abort();
    }, []);

    return (
        <Card
            loading={isLoadingGetOrderSettings}
            className={classes.main}
            bodyStyle={{padding: "20px 10px 10px 10px", borderRadius: "8px"}}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    moq: 0
                }}
                onFinish={handleMoqFeeUpdate}
            >
                <Form.Item
                    name={"fee"}
                    label={txt.moq_fee[currentLang]}
                    rules={[
                        rules.required(txt.please_enter_moq_fee[currentLang]),
                    ]}
                >
                    <NumberInput
                        value={form.getFieldValue("fee")}
                        onChange={(value: number) => form.setFieldValue("fee", value)}
                    />
                </Form.Item>

                <Form.Item
                    name={"freeFrom"}
                    label={txt.moq_minimum_price[currentLang]}
                    rules={[
                        rules.required(txt.please_enter_moq_minimum_price[currentLang]),
                    ]}
                >
                    <NumberInput
                        value={form.getFieldValue("freeFrom")}
                        onChange={(value: number) => form.setFieldValue("freeFrom", value)}
                    />
                </Form.Item>

                <Form.Item>
                    <Button
                        htmlType={"submit"}
                        type={"primary"}
                        loading={isLoadingUpdateMoqFee}
                    >
                        {txt.ok[currentLang]}
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    )
}
