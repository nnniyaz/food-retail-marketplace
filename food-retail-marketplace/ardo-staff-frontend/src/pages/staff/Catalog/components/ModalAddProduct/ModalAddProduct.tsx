import React, {FC} from "react";
import {useNavigate} from "react-router-dom";
import {useTypedSelector} from "@shared/lib/hooks/useTypedSelector";
import {useActions} from "@shared/lib/hooks/useActions";
import {useForm} from "antd/es/form/Form";
import {Form, Modal, Select} from "antd";
import {txt} from "@shared/core/i18ngen";
import {rules} from "@shared/lib/form-rules/rules";

interface ModalAddProductProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<boolean>;
    sectionId: UUID;
    categoryId: UUID;
}

export const ModalAddProduct: FC<ModalAddProductProps> = ({isOpen, setIsOpen, sectionId, categoryId}) => {
    const navigate = useNavigate();
    const {currentLang} = useTypedSelector(state => state.lang);
    const {catalog, isLoadingEditCatalog} = useTypedSelector(state => state.catalog);
    const {products} = useTypedSelector(state => state.products);
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
                            categoryId: categoryId,
                            products: [
                                ...(catalog?.structure?.find(s => s.sectionId === sectionId)?.categories?.find(c => c.categoryId === categoryId)?.products || []),
                                {
                                    productId: form.getFieldValue("productId")
                                }
                            ]
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
            title={txt.add_product_to_catalog[currentLang]}
            open={isOpen}
            onOk={form.submit}
            confirmLoading={isLoadingEditCatalog}
            onCancel={() => setIsOpen(false)}
            okText={txt.ok[currentLang]}
            cancelText={txt.cancel[currentLang]}
        >
            <Form form={form} onFinish={handleSubmit} layout={"vertical"}>
                <Form.Item
                    name={"productId"}
                    label={txt.select_product[currentLang]}
                    rules={[rules.required(txt.please_select_product[currentLang])]}
                >
                    <Select
                        placeholder={txt.select_product[currentLang]}
                        options={
                            products?.filter(product => {
                                const structureProductIds = catalog?.structure?.flatMap(section => section.categories).flatMap(category => category.products).map(product => product?.productId);
                                const promoProductIds = catalog?.promo?.flatMap(section => section.categories).flatMap(category => category.products).map(product => product?.productId);
                                return !structureProductIds?.includes(product.id) && !promoProductIds?.includes(product.id);
                            })?.map(product => ({
                                label: product.name[currentLang],
                                value: product.id
                            }))
                        }
                    />
                </Form.Item>
            </Form>
        </Modal>
    )
}
