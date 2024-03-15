import React, {FC} from "react";
import {useNavigate} from "react-router-dom";
import {Form, Modal, Select} from "antd";
import {useForm} from "antd/es/form/Form";
import {txt} from "@shared/core/i18ngen";
import {rules} from "@shared/lib/form-rules/rules";
import {useActions} from "@shared/lib/hooks/useActions";
import {useTypedSelector} from "@shared/lib/hooks/useTypedSelector";

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
    const [form] = useForm<{ sectionIds: string[] }>();

    const handleSubmit = async () => {
        if (!catalog) return;
        await editCatalog({
            structure: [
                ...(catalog?.structure || []),
                ...form.getFieldValue("sectionIds").map((sectionId: string) => ({
                    sectionId: sectionId,
                    categories: []
                }))
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
                    name={"sectionIds"}
                    label={txt.select_section[currentLang]}
                    rules={[rules.required(txt.please_select_section[currentLang])]}
                >
                    <Select
                        placeholder={txt.select_section[currentLang]}
                        showSearch={true}
                        filterOption={(input, option) => option?.label?.toLowerCase()?.includes(input.toLowerCase()) || false}
                        filterSort={(optionA, optionB) => optionA.label.localeCompare(optionB.label)}
                        mode={"multiple"}
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
