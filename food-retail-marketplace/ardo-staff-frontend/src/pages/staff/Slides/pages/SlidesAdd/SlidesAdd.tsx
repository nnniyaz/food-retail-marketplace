import React, {FC, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Button, Card, Form} from "antd";
import {useForm, useWatch} from "antd/es/form/Form";
import {RouteNames} from "@pages/index";
import {Langs, MlString} from "@entities/base/MlString";
import {txt} from "@shared/core/i18ngen";
import {rules} from "@shared/lib/form-rules/rules";
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
    const {isLoadingAddSlide} = useTypedSelector(state => state.slides);
    const {addSlide} = useActions();
    const [form] = useForm();
    const values = useWatch([], form);

    const [submittable, setSubmittable] = useState(false);

    const handleCancel = () => {
        navigate(RouteNames.SLIDES);
    }

    const handleSubmit = async () => {
        const values = form.getFieldsValue();
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
