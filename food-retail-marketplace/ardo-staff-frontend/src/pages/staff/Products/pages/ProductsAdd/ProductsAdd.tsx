import React, {FC, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Button, Card, Form, Select} from "antd";
import {useForm, useWatch} from "antd/es/form/Form";
import {RouteNames} from "@pages/index";
import {Langs, MlString} from "@entities/base/MlString";
import {ProductStatus, ProductUnit} from "@entities/product/product";
import {txt} from "@shared/core/i18ngen";
import {rules} from "@shared/lib/form-rules/rules";
import {I18NInput} from "@shared/ui/Input/I18NInput";
import {useActions} from "@shared/lib/hooks/useActions";
import {NumberInput} from "@shared/ui/Input/NumberInput";
import {I18NTextarea} from "@shared/ui/Textarea";
import {useTypedSelector} from "@shared/lib/hooks/useTypedSelector";
import {productStatusOptions} from "@shared/lib/options/productStatusOptions";
import classes from "./ProductsAdd.module.scss";
import {productCutOffTimeOptions} from "@shared/lib/options/productCutOffTimeOptions";
import {productUnitOptions} from "@shared/lib/options/productUnitOptions";
import {PlusOutlined} from "@ant-design/icons";
import {Upload} from "@shared/ui/Upload/Upload";
import {SpaceFolders} from "@entities/base/spaceFolders";

const initialFormValues = {
    name: {
        [Langs.EN]: "",
        [Langs.RU]: ""
    },
    desc: {
        [Langs.EN]: "",
        [Langs.RU]: ""
    },
    price: 0,
    originalPrice: 0,
    quantity: 0,
    unit: ProductUnit.PC,
    moq: 1,
    cutOffTime: "00:00",
    tags: [],
    img: "",
    status: ProductStatus.ACTIVE
}

export const ProductsAdd: FC = () => {
    const navigate = useNavigate();
    const {currentLang} = useTypedSelector(state => state.lang);
    const {isLoadingAddProduct, isLoadingProductImageUpload} = useTypedSelector(state => state.products);
    const {addProduct, uploadProductImage} = useActions();
    const [form] = useForm();
    const values = useWatch([], form);

    const [submittable, setSubmittable] = useState(false);

    const handleUpload = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        const filename = await uploadProductImage(formData);
        if (filename) {
            form.setFieldValue("img", filename);
        }
    }

    const handleCancel = () => {
        navigate(RouteNames.PRODUCTS);
    }

    const handleSubmit = async () => {
        const values = form.getFieldsValue();
        addProduct({
            name: values.name,
            desc: values.desc,
            price: values.price,
            originalPrice: values.originalPrice,
            quantity: values.quantity,
            unit: values.unit,
            moq: values.moq,
            cutOffTime: values.cutOffTime,
            tags: values.tags,
            img: values.img,
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
            <Card bodyStyle={{padding: "20px", borderRadius: "8px"}}>
                <Form form={form} layout={"vertical"} onFinish={handleSubmit} initialValues={initialFormValues}>
                    <div className={classes.header}>
                        <div className={classes.header__group}>
                            <Form.Item name={"img"}>
                                <Upload
                                    imgSrc={
                                        form.getFieldValue("img")
                                            ? `${import.meta.env.VITE_SPACE_HOST}/${SpaceFolders.PRODUCTS}/${form.getFieldValue("img")}`
                                            : ""
                                    }
                                    onUpload={handleUpload}
                                    loading={isLoadingProductImageUpload}
                                />
                            </Form.Item>
                        </div>
                        <div className={classes.header__group}>
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
                                required={false}
                            >
                                <I18NTextarea
                                    value={form.getFieldValue("desc")}
                                    onChange={(mlString: MlString) => form.setFieldValue("desc", mlString)}
                                    placeholder={txt.enter_desc[currentLang]}
                                />
                            </Form.Item>
                        </div>
                    </div>

                    <div className={classes.form__row}>
                        <Form.Item
                            name={"price"}
                            label={txt.price[currentLang]}
                            rules={[rules.required(txt.please_enter_price[currentLang])]}
                            className={classes.form__item}
                            required={true}
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
                            required={true}
                        >
                            <NumberInput
                                value={form.getFieldValue("quantity")}
                                onChange={(value: number) => form.setFieldValue("quantity", value)}
                            />
                        </Form.Item>

                        <Form.Item
                            name={"originalPrice"}
                            label={txt.original_price[currentLang]}
                            className={classes.form__item}
                        >
                            <NumberInput
                                value={form.getFieldValue("originalPrice")}
                                onChange={(value: number) => form.setFieldValue("originalPrice", value)}
                            />
                        </Form.Item>
                    </div>

                    <Form.Item
                        name={"tags"}
                        label={txt.tags[currentLang]}
                    >
                        <Select
                            mode={"tags"}
                            dropdownStyle={{display: "none"}}
                            placeholder={txt.enter_tags[currentLang]}
                        />
                    </Form.Item>

                    <Form.Item
                        name={"unit"}
                        label={txt.unit[currentLang]}
                        rules={[rules.required(txt.please_select_unit[currentLang])]}
                    >
                        <Select options={productUnitOptions}/>
                    </Form.Item>

                    <Form.Item
                        name={"moq"}
                        label={txt.moq[currentLang]}
                        rules={[rules.required(txt.please_enter_moq[currentLang])]}
                    >
                        <NumberInput
                            value={form.getFieldValue("moq")}
                            onChange={(value: number) => form.setFieldValue("moq", value)}
                        />
                    </Form.Item>

                    <Form.Item
                        name={"cutOffTime"}
                        label={txt.cut_off_time[currentLang]}
                        rules={[rules.required(txt.please_select_cut_off_time[currentLang])]}
                    >
                        <Select options={productCutOffTimeOptions}/>
                    </Form.Item>

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
