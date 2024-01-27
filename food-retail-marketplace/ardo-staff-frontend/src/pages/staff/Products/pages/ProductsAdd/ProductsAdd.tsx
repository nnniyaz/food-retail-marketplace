import React, {FC, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Button, Card, Form, Input, Select} from "antd";
import {useForm, useWatch} from "antd/es/form/Form";
import TextArea from "antd/lib/input/TextArea";
import {ProductStatus} from "@entities/product/product";
import {txt} from "@shared/core/i18ngen";
import {rules} from "@shared/lib/form-rules/rules";
import {useActions} from "@shared/lib/hooks/useActions";
import {useTypedSelector} from "@shared/lib/hooks/useTypedSelector";
import {RouteNames} from "@pages/index";
import classes from "./ProductsAdd.module.scss";
import {Lang, MlString} from "@entities/base/MlString";
import {I18NInput} from "@shared/ui/Input/I18NInput";
import {I18NTextarea} from "@shared/ui/Textarea";

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
        console.log(form.getFieldsValue());
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

                    {/*<div className={classes.form__row}>*/}
                    {/*    <Form.Item*/}
                    {/*        name={"price"}*/}
                    {/*        label={txt.first_name[currentLang]}*/}
                    {/*        rules={[rules.required(txt.please_enter_firstname[currentLang])]}*/}
                    {/*        className={classes.form__item}*/}
                    {/*    >*/}
                    {/*        <Input placeholder={txt.enter_firstname[currentLang]}/>*/}
                    {/*    </Form.Item>*/}

                    {/*    <Form.Item*/}
                    {/*        name={"quantity"}*/}
                    {/*        label={txt.last_name[currentLang]}*/}
                    {/*        rules={[rules.required(txt.please_enter_lastname[currentLang])]}*/}
                    {/*        className={classes.form__item}*/}
                    {/*    >*/}
                    {/*        <Input placeholder={txt.enter_lastname[currentLang]}/>*/}
                    {/*    </Form.Item>*/}
                    {/*</div>*/}

                    {/*<Form.Item*/}
                    {/*    name={"status"}*/}
                    {/*    label={txt.status[currentLang]}*/}
                    {/*    rules={[rules.required(txt.please_select_status[currentLang])]}*/}
                    {/*>*/}
                    {/*    <Select/>*/}
                    {/*</Form.Item>*/}

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
