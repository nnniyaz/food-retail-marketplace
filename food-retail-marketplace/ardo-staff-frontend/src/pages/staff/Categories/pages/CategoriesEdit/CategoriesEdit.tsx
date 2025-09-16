import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Button, Card, Form} from "antd";
import {useForm, useWatch} from "antd/es/form/Form";
import {isEmpty} from "lodash";
import {RouteNames} from "@pages/index";
import {Langs, MlString} from "@entities/base/MlString";
import {txt} from "@shared/core/i18ngen";
import {back} from "@shared/lib/back/back";
import {rules} from "@shared/lib/form-rules/rules";
import {RowInfo} from "@shared/ui/RowInfo";
import {I18NInput} from "@shared/ui/Input/I18NInput";
import {useActions} from "@shared/lib/hooks/useActions";
import {useTypedSelector} from "@shared/lib/hooks/useTypedSelector";
import classes from "./CategoriesEdit.module.scss";
import {Upload} from "@shared/ui/Upload/Upload";
import {SpaceFolders} from "@entities/base/spaceFolders";

export const CategoriesEdit = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const {currentLang} = useTypedSelector(state => state.lang);
    const {
        categoryById,
        isLoadingEditCategory,
        isLoadingDeleteCategory,
        isLoadingRecoverCategory,
        isLoadingGetCategoryById,
        isLoadingCategoryImageUpload
    } = useTypedSelector(state => state.categories);
    const {getCategoryById, editCategory, deleteCategory, recoverCategory, uploadCategoryImage} = useActions();
    const [form] = useForm<{ img: string, name: MlString, desc: MlString }>();
    const values = useWatch([], form);

    const [editMode, setEditMode] = useState(false);
    const [formInitialValues, setFormInitialValues] = useState({});
    const [submittable, setSubmittable] = useState(false);

    const handleUpload = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        const filename = await uploadCategoryImage(formData);
        if (filename) {
            form.setFieldValue("img", filename);
        }
    }

    const handleCancel = () => {
        back(RouteNames.CATEGORIES, navigate);
    }

    const handleDelete = async () => {
        if (!id) {
            return;
        }
        await deleteCategory(id, {navigate, to: RouteNames.CATEGORIES});
    }

    const handleRecovers = async () => {
        if (!id) {
            return;
        }
        await recoverCategory(id, {navigate, to: RouteNames.CATEGORIES});
    }

    const handleReset = () => {
        form.resetFields();
    }

    const handleEdit = async () => {
        if (!id) {
            return;
        }
        await editCategory(id, {
            img: values.img,
            desc: values.desc,
            name: values.name
        }, {navigate, to: RouteNames.CATEGORIES});
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
        getCategoryById(id, controller, {navigate});
        return () => controller.abort();
    }, [id]);

    useEffect(() => {
        if (isEmpty(categoryById)) {
            return;
        }
        setFormInitialValues({
            img: categoryById?.img,
            name: {
                [Langs.EN]: categoryById?.name[Langs.EN] || "",
                [Langs.RU]: categoryById?.name[Langs.RU] || ""
            },
            desc: {
                [Langs.EN]: categoryById?.desc[Langs.EN] || "",
                [Langs.RU]: categoryById?.desc[Langs.RU] || ""
            }
        });
    }, [categoryById]);

    useEffect(() => {
        if (!id) {
            navigate(RouteNames.CATEGORIES);
        }
    }, []);

    return (
        <div className={classes.main}>
            {editMode ? (
                <Card bodyStyle={{padding: "20px 10px", borderRadius: "8px"}}>
                    <Form form={form} layout={"vertical"} onFinish={handleEdit} initialValues={formInitialValues}>
                        <Form.Item name={"img"}>
                            <Upload
                                imgSrc={
                                    form.getFieldValue("img")
                                        ? `${import.meta.env.VITE_SPACE_HOST}/${SpaceFolders.CATEGORIES}/${form.getFieldValue("img")}`
                                        : ""
                                }
                                onUpload={handleUpload}
                                loading={isLoadingCategoryImageUpload}
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
                        >
                            <I18NInput
                                value={form.getFieldValue("desc")}
                                onChange={(mlString: MlString) => form.setFieldValue("desc", mlString)}
                                placeholder={txt.enter_desc[currentLang]}
                            />
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
                                    loading={isLoadingEditCategory}
                                    disabled={isLoadingEditCategory || !submittable}
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
                <Card bodyStyle={{padding: "10px", borderRadius: "8px"}} loading={isLoadingGetCategoryById}>
                    <h1 className={classes.title}>{categoryById?.name?.[currentLang]}</h1>
                    <h3 className={classes.subtitle}>{categoryById?.id || "-"}</h3>

                    {!!categoryById?.img && (
                        <div style={{margin: "20px 0"}}>
                            <Upload
                                imgSrc={
                                    categoryById?.img
                                        ? `${import.meta.env.VITE_SPACE_HOST}/${SpaceFolders.CATEGORIES}/${categoryById?.img}`
                                        : ""
                                }
                                onUpload={handleUpload}
                                loading={isLoadingCategoryImageUpload}
                            />
                        </div>
                    )}

                    <RowInfo
                        label={txt.desc[currentLang]}
                        value={categoryById?.desc?.[currentLang] || "-"}
                    />

                    <div className={classes.row__btns}>
                        <Button onClick={handleCancel}>
                            {txt.back[currentLang]}
                        </Button>
                        <Button
                            onClick={categoryById?.isDeleted ? handleRecovers : handleDelete}
                            loading={isLoadingDeleteCategory || isLoadingRecoverCategory}
                            danger={!categoryById?.isDeleted}
                            type={"primary"}
                        >
                            {categoryById?.isDeleted ? txt.recover[currentLang] : txt.delete[currentLang]}
                        </Button>
                        <Button onClick={() => setEditMode(true)} type={"primary"}>
                            {txt.edit[currentLang]}
                        </Button>
                    </div>
                </Card>
            )}
        </div>
    )
}
