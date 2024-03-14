import React, {FC, useMemo} from "react";
import {Form, Modal, Select} from "antd";
import {txt} from "@shared/core/i18ngen";
import {useTypedSelector} from "@shared/lib/hooks/useTypedSelector";
import {useActions} from "@shared/lib/hooks/useActions";
import {useNavigate} from "react-router-dom";
import {useForm} from "antd/es/form/Form";
import {rules} from "@shared/lib/form-rules/rules";

interface ModalAddSectionProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<boolean>;
}

export const ModalAddSection: FC<ModalAddSectionProps> = ({isOpen, setIsOpen}) => {
    const navigate = useNavigate();
    const {currentLang} = useTypedSelector(state => state.lang);
    const {catalog, isLoadingEditCatalog} = useTypedSelector(state => state.catalog);
    const {sections} = useTypedSelector(state => state.sections);
    const {editCatalog} = useActions();
    const [form] = useForm();

    const handleSubmit = async () => {
        if (!catalog) return;
        await editCatalog({
            structure: [
                ...(catalog?.structure || []),
                {
                    sectionId: form.getFieldValue("sectionId"),
                    categories: []
                }
            ],
            promo: [...(catalog?.promo || [])]
        }, catalog.id, {navigate: navigate});
        setIsOpen(false);
    }

    return (
        <Modal
            title={txt.add_section_to_catalog[currentLang]}
            open={isOpen}
            onOk={form.submit}
            confirmLoading={isLoadingEditCatalog}
            onCancel={() => setIsOpen(false)}
            okText={txt.ok[currentLang]}
            cancelText={txt.cancel[currentLang]}
        >
            <Form form={form} onFinish={handleSubmit} layout={"vertical"}>
                <Form.Item
                    name={"sectionId"}
                    label={txt.select_section[currentLang]}
                    rules={[rules.required(txt.please_select_section[currentLang])]}
                >
                    <Select
                        placeholder={txt.select_section[currentLang]}
                        options={
                            sections?.filter(section => {
                                const structureSectionIds = catalog?.structure?.map(section => section.sectionId);
                                const promoSectionIds = catalog?.promo?.map(section => section.sectionId);
                                return !structureSectionIds?.includes(section.id) && !promoSectionIds?.includes(section.id);
                            })?.map(section => ({
                                label: section.name[currentLang],
                                value: section.id
                            }))
                        }
                    />
                </Form.Item>
            </Form>
        </Modal>
    )
}
