import React, {FC} from "react";
import {useNavigate} from "react-router-dom";
import {useTypedSelector} from "@shared/lib/hooks/useTypedSelector";
import {useActions} from "@shared/lib/hooks/useActions";
import {useForm} from "antd/es/form/Form";
import {Form, Modal, Select} from "antd";
import {txt} from "@shared/core/i18ngen";
import {rules} from "@shared/lib/form-rules/rules";

interface ModalAddCategoryProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<boolean>;
    sectionId: UUID;
}

export const ModalAddCategory: FC<ModalAddCategoryProps> = ({isOpen, setIsOpen, sectionId}) => {
    const navigate = useNavigate();
    const {currentLang} = useTypedSelector(state => state.lang);
    const {catalog, isLoadingEditCatalog} = useTypedSelector(state => state.catalog);
    const {categories} = useTypedSelector(state => state.categories);
    const {editCatalog} = useActions();
    const [form] = useForm();

    const handleSubmit = async () => {
        if (!catalog) return;
        await editCatalog({
            structure: [
                ...(catalog?.structure || []),
                {
                    sectionId: sectionId,
                    categories: [
                        ...(catalog?.structure?.find(s => s.sectionId === sectionId)?.categories || []),
                        {
                            categoryId: form.getFieldValue("categoryId"),
                            products: []
                        }
                    ]
                }
            ],
            promo: [...(catalog?.promo || [])]
        }, catalog.id, {navigate: navigate});
        setIsOpen(false);
    }

    return (
        <Modal
            title={txt.add_category_to_catalog[currentLang]}
            open={isOpen}
            onOk={form.submit}
            confirmLoading={isLoadingEditCatalog}
            onCancel={() => setIsOpen(false)}
            okText={txt.ok[currentLang]}
            cancelText={txt.cancel[currentLang]}
        >
            <Form form={form} onFinish={handleSubmit} layout={"vertical"}>
                <Form.Item
                    name={"categoryId"}
                    label={txt.select_category[currentLang]}
                    rules={[rules.required(txt.please_select_category[currentLang])]}
                >
                    <Select
                        placeholder={txt.select_category[currentLang]}
                        options={
                            categories?.filter(category => {
                                const structureCategoryIds = catalog?.structure?.map(section => section.categories.map(category => category.categoryId)).flat();
                                const promoCategoryIds = catalog?.promo?.map(section => section.categories.map(category => category.categoryId)).flat();
                                return !structureCategoryIds?.includes(category.id) && !promoCategoryIds?.includes(category.id);
                            })?.map(category => ({
                                label: category.name[currentLang],
                                value: category.id
                            }))
                        }
                    />
                </Form.Item>
            </Form>
        </Modal>
    )
}
