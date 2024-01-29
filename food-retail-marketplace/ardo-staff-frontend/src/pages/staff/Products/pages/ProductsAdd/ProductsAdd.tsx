import React, {FC, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Button, Card, Form, Select} from "antd";
import {useForm, useWatch} from "antd/es/form/Form";
import {MlString} from "@entities/base/MlString";
import {ProductStatus} from "@entities/product/product";
import {txt} from "@shared/core/i18ngen";
import {rules} from "@shared/lib/form-rules/rules";
import {I18NInput} from "@shared/ui/Input/I18NInput";
import {useActions} from "@shared/lib/hooks/useActions";
import {NumberInput} from "@shared/ui/Input/NumberInput";
import {I18NTextarea} from "@shared/ui/Textarea";
import {useTypedSelector} from "@shared/lib/hooks/useTypedSelector";
import {productStatusOptions} from "@shared/lib/options/productStatusOptions";
import {RouteNames} from "@pages/index";
import classes from "./ProductsAdd.module.scss";

const initialFormValues = {
    name: {},
    desc: {},
    price: 0,
    quantity: 0,
    image: "",
    status: ProductStatus.ACTIVE
}

export const ProductsAdd: FC = () => {
    const navigate = useNavigate();
    const {currentLang} = useTypedSelector(state => state.lang);
    const {isLoadingAddProduct} = useTypedSelector(state => state.products);
    const {addProduct} = useActions();
    const [form] = useForm();
    const values = useWatch([], form);

    const [submittable, setSubmittable] = useState(false);

    const handleCancel = () => {
        navigate(RouteNames.PRODUCTS);
    }

    const handleSubmit = async () => {
        const values = form.getFieldsValue();
        addProduct({
            name: values.name,
            desc: values.desc,
            price: values.price,
            quantity: values.quantity,
            img: "",
            status: values.status
        }, {navigate, to: RouteNames.PRODUCTS});
    }

    useEffect(() => {
        form.validateFields({validateOnly: true}).then(
            () => setSubmittable(true),
            () => setSubmittable(false),
        );
    }, [values]);

    useEffect(() => {
        form.setFieldsValue(initialFormValues);
    }, []);

    return (
        <div className={classes.main}>
            <Card bodyStyle={{padding: "20px 10px", borderRadius: "8px"}}>
                <Form form={form} layout={"vertical"} onFinish={handleSubmit} initialValues={initialFormValues}>
                    <Form.Item
                        name={"name"}
                        label={txt.name[currentLang]}
                        rules={[rules.requiredI18n(txt.please_enter_name[currentLang])]}
                        required={true}
                    >
                        <I18NInput
                            value={form.getFieldValue("name")}
                            onChange={(mlString: MlString) => form.setFieldValue("name", mlString)}
                            placeholder={txt.enter_name[currentLang]}
                        />
                    </Form.Item>

                    <Form.Item
                        name={"desc"}
                        label={txt.desc[currentLang]}
                        rules={[rules.requiredI18n(txt.please_enter_desc[currentLang])]}
                        required={true}
                    >
                        <I18NTextarea
                            value={form.getFieldValue("desc")}
                            onChange={(mlString: MlString) => form.setFieldValue("desc", mlString)}
                            placeholder={txt.enter_desc[currentLang]}
                        />
                    </Form.Item>

                    <div className={classes.form__row}>
                        <Form.Item
                            name={"price"}
                            label={txt.price[currentLang]}
                            rules={[rules.required(txt.please_enter_price[currentLang])]}
                            className={classes.form__item}
                        >
                            <NumberInput
                                value={form.getFieldValue("price")}
                                onChange={(value: number) => form.setFieldValue("price", value)}
                            />
                        </Form.Item>

                        <Form.Item
                            name={"quantity"}
                            label={txt.quantity[currentLang]}
                            rules={[rules.required(txt.please_enter_quantity[currentLang])]}
                            className={classes.form__item}
                        >
                            <NumberInput
                                value={form.getFieldValue("quantity")}
                                onChange={(value: number) => form.setFieldValue("quantity", value)}
                            />
                        </Form.Item>
                    </div>

                    <Form.Item
                        name={"status"}
                        label={txt.status[currentLang]}
                        rules={[rules.required(txt.please_select_status[currentLang])]}
                    >
                        <Select options={productStatusOptions(currentLang)}/>
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
                                loading={isLoadingAddProduct}
                                disabled={isLoadingAddProduct || !submittable}
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
