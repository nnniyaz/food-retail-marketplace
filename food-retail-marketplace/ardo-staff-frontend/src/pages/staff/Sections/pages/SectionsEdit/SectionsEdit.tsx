import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Button, Card, Form} from "antd";
import {useForm, useWatch} from "antd/es/form/Form";
import {isEmpty} from "lodash";
import {RouteNames} from "@pages/index";
import {Langs, MlString} from "@entities/base/MlString";
import {useActions} from "@shared/lib/hooks/useActions";
import {useTypedSelector} from "@shared/lib/hooks/useTypedSelector";
import {txt} from "@shared/core/i18ngen";
import {rules} from "@shared/lib/form-rules/rules";
import {RowInfo} from "@shared/ui/RowInfo";
import {I18NInput} from "@shared/ui/Input/I18NInput";
import classes from "./SectionsEdit.module.scss";

export const SectionsEdit = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const {currentLang} = useTypedSelector(state => state.lang);
    const {
        sectionById,
        isLoadingEditSection,
        isLoadingDeleteSection,
        isLoadingRecoverSection,
        isLoadingGetSectionById
    } = useTypedSelector(state => state.sections);
    const {getSectionById, editSection, deleteSection, recoverSection} = useActions();
    const [form] = useForm();
    const values = useWatch([], form);

    const [editMode, setEditMode] = useState(false);
    const [formInitialValues, setFormInitialValues] = useState({});
    const [submittable, setSubmittable] = useState(false);

    const handleCancel = () => {
        navigate(RouteNames.SECTIONS);
    }

    const handleDelete = async () => {
        if (!id) {
            return;
        }
        await deleteSection(id, {navigate, to: RouteNames.SECTIONS});
    }

    const handleRecovers = async () => {
        if (!id) {
            return;
        }
        await recoverSection(id, {navigate, to: RouteNames.SECTIONS});
    }

    const handleReset = () => {
        form.resetFields();
    }

    const handleEdit = async () => {
        if (!id) {
            return;
        }
        await editSection(id, {
            img: values.img,
            name: values.name
        }, {navigate, to: RouteNames.SECTIONS});
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
        getSectionById(id, controller, {navigate});
        return () => controller.abort();
    }, [id]);

    useEffect(() => {
        if (isEmpty(sectionById)) {
            return;
        }
        setFormInitialValues({
            img: sectionById?.img,
            name: {
                [Langs.EN]: sectionById?.name[Langs.EN] || "",
                [Langs.RU]: sectionById?.name[Langs.RU] || ""
            }
        });
    }, [sectionById]);

    useEffect(() => {
        if (!id) {
            navigate(RouteNames.SECTIONS);
        }
    }, []);

    return (
        <div className={classes.main}>
            {editMode ? (
                <Card bodyStyle={{padding: "20px 10px", borderRadius: "8px"}}>
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

                        <Form.Item style={{margin: "0"}}>
                            <div className={classes.row__btns}>
                                <Button onClick={() => setEditMode(false)}>
                                    {txt.cancel[currentLang]}
                                </Button>
                                <Button onClick={handleReset}>
                                    {txt.reset[currentLang]}
                                </Button>
                                <Button
                                    loading={isLoadingEditSection}
                                    disabled={isLoadingEditSection || !submittable}
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
                <Card bodyStyle={{padding: "10px", borderRadius: "8px"}} loading={isLoadingGetSectionById}>
                    <h1 className={classes.title}>{sectionById?.name?.[currentLang]}</h1>
                    <h3 className={classes.subtitle}>{sectionById?.id || "-"}</h3>

                    <div className={classes.row__btns}>
                        <Button onClick={handleCancel}>
                            {txt.back[currentLang]}
                        </Button>
                        <Button
                            onClick={sectionById?.isDeleted ? handleRecovers : handleDelete}
                            loading={isLoadingDeleteSection || isLoadingRecoverSection}
                            danger={!sectionById?.isDeleted}
                            type={"primary"}
                        >
                            {sectionById?.isDeleted ? txt.recover[currentLang] : txt.delete[currentLang]}
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
