import React, {FC, useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {isEmpty} from "lodash";
import {Button, Card, Form, Select} from "antd";
import {useForm, useWatch} from "antd/es/form/Form";
import {RouteNames} from "@pages/index";
import {MlString} from "@entities/base/MlString";
import {txt} from "@shared/core/i18ngen";
import {back} from "@shared/lib/back/back";
import {rules} from "@shared/lib/form-rules/rules";
import {RowInfo} from "@shared/ui/RowInfo";
import {I18NInput} from "@shared/ui/Input/I18NInput";
import {dateFormat} from "@shared/lib/date/date-format";
import {useActions} from "@shared/lib/hooks/useActions";
import {NumberInput} from "@shared/ui/Input/NumberInput";
import {I18NTextarea} from "@shared/ui/Textarea";
import {useTypedSelector} from "@shared/lib/hooks/useTypedSelector";
import {productStatusOptions} from "@shared/lib/options/productStatusOptions";
import classes from "./ProductsEdit.module.scss";
import {ProductUnit} from "@entities/product/product";
import {Upload} from "@shared/ui/Upload/Upload";
import {productUnitOptions} from "@shared/lib/options/productUnitOptions";
import {productCutOffTimeOptions} from "@shared/lib/options/productCutOffTimeOptions";
import {SpaceFolders} from "@entities/base/spaceFolders";

export const ProductsEdit: FC = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const {currentLang} = useTypedSelector(state => state.lang);
    const {
        productById,
        isLoadingGetProductById,
        isLoadingEditProduct,
        isLoadingDeleteProduct,
        isLoadingRecoverProduct,
        isLoadingProductImageUpload
    } = useTypedSelector(state => state.products);
    const {
        getProductById,
        editProductCredentials,
        deleteProduct,
        recoverProduct,
        uploadProductImage
    } = useActions();
    const [form] = useForm();
    const values = useWatch([], form);

    const [editMode, setEditMode] = useState(false);
    const [formInitialValues, setFormInitialValues] = useState({});
    const [submittable, setSubmittable] = React.useState(false);

    const handleCancel = () => {
        back(RouteNames.PRODUCTS, navigate);
    }

    const handleDelete = async () => {
        if (!id) {
            return;
        }
        await deleteProduct(id, {navigate, to: RouteNames.PRODUCTS});
    }

    const handleRecovers = async () => {
        if (!id) {
            return;
        }
        await recoverProduct(id, {navigate, to: RouteNames.PRODUCTS});
    }

    const handleReset = () => {
        form.resetFields();
    }

    const handleUpload = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        const filename = await uploadProductImage(formData);
        if (filename) {
            form.setFieldValue("img", filename);
        }
    }

    const handleEdit = async () => {
        if (!id) {
            return;
        }
        await editProductCredentials(id, form.getFieldsValue(), {navigate, to: RouteNames.PRODUCTS});
        setEditMode(false);
    }

    useEffect(() => {
        form.validateFields({validateOnly: true}).then(
            () => setSubmittable(true),
            () => setSubmittable(false),
        );
    }, [values]);

    useEffect(() => {
        if (!id) {
            return;
        }
        const controller = new AbortController();
        getProductById(id, controller, {navigate});
        return () => controller.abort();
    }, [id]);

    useEffect(() => {
        if (isEmpty(productById)) {
            return;
        }
        setFormInitialValues({
            name: productById?.name,
            desc: productById?.desc,
            price: productById?.price,
            originalPrice: productById?.originalPrice || 0,
            quantity: productById?.quantity,
            unit: productById?.unit || ProductUnit.PC,
            moq: productById?.moq || 1,
            cutOffTime: productById?.cutOffTime || "12:00",
            tags: productById?.tags || [],
            img: productById?.img,
            status: productById?.status,
        });
    }, [productById]);

    useEffect(() => {
        if (!id) {
            navigate(RouteNames.PRODUCTS);
        }
    }, []);

    return (
        <div className={classes.main}>
            {editMode ? (
                <Card bodyStyle={{padding: "10px", borderRadius: "8px"}} loading={isLoadingGetProductById}>
                    <RowInfo label={txt.id[currentLang]} value={productById?.id || "-"}/>
                    <RowInfo label={txt.created_at[currentLang]}
                             value={dateFormat(productById?.createdAt || "") || "-"}/>
                    <RowInfo label={txt.updated_at[currentLang]}
                             value={dateFormat(productById?.updatedAt || "") || "-"}/>

                    <Form form={form} layout={"vertical"} onFinish={handleEdit} initialValues={formInitialValues}>
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
                            <div className={classes.row__btns} style={{marginTop: "0"}}>
                                <Button onClick={() => setEditMode(false)}>
                                    {txt.cancel[currentLang]}
                                </Button>
                                <Button onClick={handleReset}>
                                    {txt.reset[currentLang]}
                                </Button>
                                <Button
                                    loading={isLoadingEditProduct}
                                    disabled={isLoadingEditProduct || !submittable}
                                    type={"primary"}
                                    htmlType={"submit"}
                                    style={{margin: "0"}}
                                    className={classes.btn}
                                >
                                    {txt.edit[currentLang]}
                                </Button>
                            </div>
                        </Form.Item>
                    </Form>
                </Card>
            ) : (
                <Card bodyStyle={{padding: "10px", borderRadius: "8px"}} loading={isLoadingGetProductById}>
                    <h1 className={classes.title}>{productById?.name?.[currentLang]}</h1>
                    <h3 className={classes.subtitle}>{productById?.id || "-"}</h3>

                    {!!productById?.img && (
                        <div style={{margin: "20px 0"}}>
                            <Upload
                                imgSrc={
                                    productById?.img
                                        ? `${import.meta.env.VITE_SPACE_HOST}/${SpaceFolders.PRODUCTS}/${productById?.img}`
                                        : ""
                                }
                            />
                        </div>
                    )}

                    <RowInfo
                        label={txt.price[currentLang]}
                        value={`${productById?.price || "-"}`}
                    />
                    <RowInfo
                        label={txt.quantity[currentLang]}
                        value={`${productById?.quantity || "-"}`}
                    />
                    <RowInfo
                        label={txt.unit[currentLang]}
                        value={`${productById?.unit || "-"}`}
                    />
                    <RowInfo
                        label={txt.moq[currentLang]}
                        value={`${productById?.moq || "-"}`}
                    />
                    <RowInfo
                        label={txt.cut_off_time[currentLang]}
                        value={`${productById?.cutOffTime || "-"}`}
                    />
                    <RowInfo
                        label={txt.original_price[currentLang]}
                        value={`${productById?.originalPrice || "-"}`}
                    />
                    <RowInfo
                        label={txt.tags[currentLang]}
                        value={`${productById?.tags?.join(", ") || "-"}`}
                    />
                    <RowInfo
                        label={txt.created_at[currentLang]}
                        value={dateFormat(productById?.createdAt || "") || "-"}
                    />
                    <RowInfo
                        label={txt.updated_at[currentLang]}
                        value={dateFormat(productById?.updatedAt || "") || "-"}
                    />
                    <RowInfo
                        label={txt.desc[currentLang]}
                        value={productById?.desc?.[currentLang] || "-"}
                    />

                    <div className={classes.row__btns}>
                        <Button onClick={handleCancel}>
                            {txt.back[currentLang]}
                        </Button>
                        <Button
                            onClick={productById?.isDeleted ? handleRecovers : handleDelete}
                            loading={isLoadingDeleteProduct || isLoadingRecoverProduct}
                            danger={!productById?.isDeleted}
                            type={"primary"}
                        >
                            {productById?.isDeleted ? txt.recover[currentLang] : txt.delete[currentLang]}
                        </Button>
                        <Button onClick={() => setEditMode(true)} type={"primary"}>
                            {txt.edit[currentLang]}
                        </Button>
                    </div>
                </Card>
            )}
        </div>
    );
};

