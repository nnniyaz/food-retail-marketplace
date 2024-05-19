import React, {FC, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useForm, useWatch} from "antd/es/form/Form";
import {Button, Card, Form} from "antd";
import {RouteNames} from "@pages//";
import {SpaceFolders} from "@entities/base/spaceFolders";
import {Langs, MlString} from "@entities/base/MlString";
import {txt} from "@shared/core/i18ngen";
import {rules} from "@shared/lib/form-rules/rules";
import {Upload} from "@shared/ui/Upload/Upload";
import {I18NInput} from "@shared/ui/Input/I18NInput";
import {useActions} from "@shared/lib/hooks/useActions";
import {useTypedSelector} from "@shared/lib/hooks/useTypedSelector";
import classes from "./SectionsAdd.module.scss";

const initialFormValues = {
    img: "",
    name: {
        [Langs.EN]: "",
        [Langs.RU]: ""
    }
}

export const SectionsAdd: FC = () => {
    const navigate = useNavigate();
    const {currentLang} = useTypedSelector(state => state.lang);
    const {isLoadingAddSection, isLoadingSectionImageUpload} = useTypedSelector(state => state.sections);
    const {addSection, uploadSectionImage} = useActions();
    const [form] = useForm();
    const values = useWatch([], form);

    const [submittable, setSubmittable] = useState(false);

    const handleUpload = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        const filename = await uploadSectionImage(formData);
        if (filename) {
            form.setFieldValue("img", filename);
        }
    }

    const handleCancel = () => {
        navigate(RouteNames.SECTIONS);
    }

    const handleSubmit = async () => {
        const values = form.getFieldsValue();
        await addSection({
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

    return (
        <div className={classes.main}>
            <Card bodyStyle={{padding: "20px 10px", borderRadius: "8px"}}>
                <Form form={form} layout={"vertical"} onFinish={handleSubmit} initialValues={initialFormValues}>
                    <Form.Item name={"img"}>
                        <Upload
                            imgSrc={
                                form.getFieldValue("img")
                                    ? `${import.meta.env.VITE_SPACE_HOST}/${SpaceFolders.SECTIONS}/${form.getFieldValue("img")}`
                                    : ""
                            }
                            onUpload={handleUpload}
                            loading={isLoadingSectionImageUpload}
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
                                loading={isLoadingAddSection}
                                disabled={isLoadingAddSection || !submittable}
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
    )
}
