import React, {FC, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Button, Card, Form} from "antd";
import {useForm, useWatch} from "antd/es/form/Form";
import {RouteNames} from "@pages/index";
import {SpaceFolders} from "@entities/base/spaceFolders";
import {Langs, MlString} from "@entities/base/MlString";
import {txt} from "@shared/core/i18ngen";
import {Upload} from "@shared/ui/Upload/Upload";
import {Notify} from "@shared/lib/notification/notification";
import {I18NInput} from "@shared/ui/Input/I18NInput";
import {useActions} from "@shared/lib/hooks/useActions";
import {useTypedSelector} from "@shared/lib/hooks/useTypedSelector";
import classes from "./SlidesAdd.module.scss";

const initialFormValues = {
    img: "",
    caption: {
        [Langs.EN]: "",
        [Langs.RU]: ""
    }
}

export const SlidesAdd: FC = () => {
    const navigate = useNavigate();
    const {currentLang} = useTypedSelector(state => state.lang);
    const {isLoadingAddSlide, isLoadingSlideImageUpload} = useTypedSelector(state => state.slides);
    const {addSlide, uploadSlideImage} = useActions();
    const [form] = useForm();
    const values = useWatch([], form);

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
        navigate(RouteNames.SLIDES);
    }

    const handleSubmit = async () => {
        const values = form.getFieldsValue();
        if (!values.img) {
            Notify.Info({title: txt.please_upload_image[currentLang], message: ""})
            return;
        }
        await addSlide({
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

    return (
        <div className={classes.main}>
            <Card bodyStyle={{padding: "20px 10px", borderRadius: "8px"}}>
                <Form form={form} layout={"vertical"} onFinish={handleSubmit} initialValues={initialFormValues}>
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
                    >
                        <I18NInput
                            value={form.getFieldValue("caption")}
                            onChange={(mlString: MlString) => form.setFieldValue("caption", mlString)}
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
                                loading={isLoadingAddSlide}
                                disabled={isLoadingAddSlide || !submittable}
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
