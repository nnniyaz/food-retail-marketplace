import React, {FC} from "react";
import {Form, Modal, Select} from "antd";
import {useForm} from "antd/es/form/Form";
import {txt} from "@shared/core/i18ngen";
import {rules} from "@shared/lib/form-rules/rules";
import {useActions} from "@shared/lib/hooks/useActions";
import {useTypedSelector} from "@shared/lib/hooks/useTypedSelector";

interface ModalAddCategoryProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<boolean>;
    sectionId: UUID;
    isPromo?: boolean;
}

export const ModalAddCategory: FC<ModalAddCategoryProps> = ({isOpen, setIsOpen, sectionId, isPromo}) => {
    const {currentLang} = useTypedSelector(state => state.lang);
    const {catalog} = useTypedSelector(state => state.catalog);
    const {categories} = useTypedSelector(state => state.categories);
    const {setCatalog} = useActions();
    const [form] = useForm<{ categoryIds: string[] }>();

    const handleSubmit = () => {
        if (!catalog) return;
        if (isPromo) {
            const updatedPromo = catalog?.promo?.map(section => {
                if (section.sectionId === sectionId) {
                    return {
                        sectionId: sectionId,
                        categories: [
                            ...(section.categories || []),
                            ...form.getFieldValue("categoryIds").map((categoryId: string) => ({
                                categoryId: categoryId,
                                products: []
                            }))
                        ]
                    }
                }
                return section;
            });
            setCatalog({...catalog, promo: updatedPromo});
        } else {
            const updatedStructure = catalog?.structure?.map(section => {
                if (section.sectionId === sectionId) {
                    return {
                        sectionId: sectionId,
                        categories: [
                            ...(section.categories || []),
                            ...form.getFieldValue("categoryIds").map((categoryId: string) => ({
                                categoryId: categoryId,
                                products: []
                            }))
                        ]
                    }
                }
                return section;
            });
            setCatalog({...catalog, structure: updatedStructure});
        }
        setIsOpen(false);
    }

    return (
        <Modal
            title={txt.add_category_to_catalog[currentLang]}
            open={isOpen}
            onOk={form.submit}
            onCancel={() => setIsOpen(false)}
            okText={txt.ok[currentLang]}
            cancelText={txt.cancel[currentLang]}
        >
            <Form form={form} onFinish={handleSubmit} layout={"vertical"}>
                <Form.Item
                    name={"categoryIds"}
                    label={txt.select_category[currentLang]}
                    rules={[rules.required(txt.please_select_category[currentLang])]}
                >
                    <Select
                        placeholder={txt.select_category[currentLang]}
                        showSearch={true}
                        filterOption={(input, option) => option?.label?.toLowerCase()?.includes(input.toLowerCase()) || false}
                        filterSort={(optionA, optionB) => optionA.label.localeCompare(optionB.label)}
                        mode={"multiple"}
                        options={
                            categories?.filter(category => {
                                const structureCategoryIds = catalog?.structure?.map(section => section?.categories?.map(category => category.categoryId)).flat();
                                const promoCategoryIds = catalog?.promo?.map(section => section?.categories?.map(category => category.categoryId)).flat();
                                return !structureCategoryIds?.includes(category.id) && !promoCategoryIds?.includes(category.id);
                            })?.map(category => ({
                                label: category.name[currentLang] || `${txt.not_translated[currentLang]} - ID: ${category.id}`,
                                value: category.id
                            }))
                        }
                    />
                </Form.Item>
            </Form>
        </Modal>
    )
}
