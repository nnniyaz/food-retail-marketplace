import React, {FC, useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Button, Card, Form} from "antd";
import {useForm, useWatch} from "antd/es/form/Form";
import {isEmpty} from "lodash";
import {RouteNames} from "@pages/index";
import {Langs, MlString} from "@entities/base/MlString";
import {txt} from "@shared/core/i18ngen";
import {back} from "@shared/lib/back/back";
import {rules} from "@shared/lib/form-rules/rules";
import {Upload} from "@shared/ui/Upload/Upload";
import {I18NInput} from "@shared/ui/Input/I18NInput";
import {useActions} from "@shared/lib/hooks/useActions";
import {SpaceFolders} from "@entities/base/spaceFolders";
import {useTypedSelector} from "@shared/lib/hooks/useTypedSelector";
import classes from "./SlidesEdit.module.scss";

export const SlidesEdit: FC = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const {currentLang} = useTypedSelector(state => state.lang);
    const {
        slideById,
        isLoadingEditSlide,
        isLoadingDeleteSlide,
        isLoadingRecoverSlide,
        isLoadingGetSlideById,
        isLoadingSlideImageUpload
    } = useTypedSelector(state => state.slides);
    const {getSlideById, editSlide, deleteSlide, recoverSlide, uploadSlideImage} = useActions();
    const [form] = useForm();
    const values = useWatch([], form);

    const [editMode, setEditMode] = useState(false);
    const [formInitialValues, setFormInitialValues] = useState({});
    const [submittable, setSubmittable] = useState(false);

    const handleUpload = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        const filename = await uploadSlideImage(formData);
        if (filename) {
            form.setFieldValue("img", filename);
        }
    }

    const handleCancel = () => {
        back(RouteNames.SLIDES, navigate);
    }

    const handleDelete = async () => {
        if (!id) {
            return;
        }
        await deleteSlide(id, {navigate, to: RouteNames.SLIDES});
    }

    const handleRecovers = async () => {
        if (!id) {
            return;
        }
        await recoverSlide(id, {navigate, to: RouteNames.SLIDES});
    }

    const handleReset = () => {
        form.resetFields();
    }

    const handleEdit = async () => {
        if (!id) {
            return;
        }
        await editSlide(id, {
            img: values.img,
            caption: values.caption
        }, {navigate, to: RouteNames.SLIDES});
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
        getSlideById(id, controller, {navigate});
        return () => controller.abort();
    }, [id]);

    useEffect(() => {
        if (isEmpty(slideById)) {
            return;
        }
        setFormInitialValues({
            img: slideById?.img,
            name: {
                [Langs.EN]: slideById?.caption[Langs.EN] || "",
                [Langs.RU]: slideById?.caption[Langs.RU] || ""
            }
        });
    }, [slideById]);

    useEffect(() => {
        if (!id) {
            navigate(RouteNames.SLIDES);
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
                                        ? `${import.meta.env.VITE_SPACE_HOST}/${SpaceFolders.SLIDES}/${form.getFieldValue("img")}`
                                        : ""
                                }
                                onUpload={handleUpload}
                                loading={isLoadingSlideImageUpload}
                            />
                        </Form.Item>

                        <Form.Item
                            name={"caption"}
                            label={txt.name[currentLang]}
                            rules={[rules.requiredI18n(txt.please_enter_name[currentLang])]}
                            required={true}
                        >
                            <I18NInput
                                value={form.getFieldValue("caption")}
                                onChange={(mlString: MlString) => form.setFieldValue("caption", mlString)}
                                placeholder={txt.enter_name[currentLang]}
                            />
                        </Form.Item>

                        <Form.Item style={{margin: "0"}}>
                            <div className={classes.row__btns}>
                                <Button onClick={() => setEditMode(false)}>
                                    {txt.cancel[currentLang]}
                                </Button>
                                <Button onClick={handleReset}>
                                    {txt.reset[currentLang]}
                                </Button>
                                <Button
                                    loading={isLoadingEditSlide}
                                    disabled={isLoadingEditSlide || !submittable}
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
                <Card bodyStyle={{padding: "10px", borderRadius: "8px"}} loading={isLoadingGetSlideById}>
                    <h1 className={classes.title}>{slideById?.caption?.[currentLang]}</h1>
                    <h3 className={classes.subtitle}>{slideById?.id || "-"}</h3>

                    {!!slideById?.img && (
                        <div style={{margin: "20px 0"}}>
                            <Upload
                                imgSrc={
                                    slideById?.img
                                        ? `${import.meta.env.VITE_SPACE_HOST}/${SpaceFolders.SLIDES}/${slideById?.img}`
                                        : ""
                                }
                                loading={isLoadingSlideImageUpload}
                            />
                        </div>
                    )}

                    <div className={classes.row__btns}>
                        <Button onClick={handleCancel}>
                            {txt.back[currentLang]}
                        </Button>
                        <Button
                            onClick={slideById?.isDeleted ? handleRecovers : handleDelete}
                            loading={isLoadingDeleteSlide || isLoadingRecoverSlide}
                            danger={!slideById?.isDeleted}
                            type={"primary"}
                        >
                            {slideById?.isDeleted ? txt.recover[currentLang] : txt.delete[currentLang]}
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
