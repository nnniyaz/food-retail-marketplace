import React, {FC, useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {isEmpty} from "lodash";
import {Button, Card, Form, Select} from "antd";
import {useForm, useWatch} from "antd/es/form/Form";
import {MlString} from "@entities/base/MlString";
import {txt} from "@shared/core/i18ngen";
import {rules} from "@shared/lib/form-rules/rules";
import {RowInfo} from "@shared/ui/RowInfo";
import {I18NInput} from "@shared/ui/Input/I18NInput";
import {dateFormat} from "@shared/lib/utils/date-format";
import {useActions} from "@shared/lib/hooks/useActions";
import {NumberInput} from "@shared/ui/Input/NumberInput";
import {I18NTextarea} from "@shared/ui/Textarea";
import {useTypedSelector} from "@shared/lib/hooks/useTypedSelector";
import {productStatusOptions} from "@shared/lib/options/productStatusOptions";
import {RouteNames} from "@pages/index";
import classes from "./ProductsEdit.module.scss";

export const ProductsEdit: FC = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const {currentLang} = useTypedSelector(state => state.lang);
    const {
        productById,
        isLoadingGetProductById,
        isLoadingEditProduct,
        isLoadingDeleteProduct,
        isLoadingRecoverProduct
    } = useTypedSelector(state => state.products);
    const {
        getProductById,
        editProductCredentials,
        deleteProduct,
        recoverProduct,
    } = useActions();
    const [form] = useForm();
    const values = useWatch([], form);

    const [editMode, setEditMode] = useState(false);
    const [formInitialValues, setFormInitialValues] = useState({});
    const [submittable, setSubmittable] = React.useState(false);

    const handleCancel = () => {
        navigate(RouteNames.PRODUCTS);
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
            quantity: productById?.quantity,
            img: "",
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
                    <RowInfo label={txt.created_at[currentLang]} value={dateFormat(productById?.createdAt || "") || "-"}/>
                    <RowInfo label={txt.updated_at[currentLang]} value={dateFormat(productById?.updatedAt || "") || "-"}/>

                    <Form form={form} layout={"vertical"} onFinish={handleEdit} initialValues={formInitialValues}>
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
                    <RowInfo
                        label={txt.desc[currentLang]}
                        value={productById?.desc?.[currentLang] || "-"}
                    />
                    <RowInfo
                        label={txt.price[currentLang]}
                        value={`${productById?.price}` || "-"}
                    />
                    <RowInfo
                        label={txt.quantity[currentLang]}
                        value={`${productById?.quantity}` || "-"}
                    />
                    <RowInfo
                        label={txt.created_at[currentLang]}
                        value={dateFormat(productById?.createdAt || "") || "-"}
                    />
                    <RowInfo
                        label={txt.updated_at[currentLang]}
                        value={dateFormat(productById?.updatedAt || "") || "-"}
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

