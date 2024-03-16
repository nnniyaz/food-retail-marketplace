import React, {FC} from "react";
import {useForm} from "antd/es/form/Form";
import {Form, Modal, Select} from "antd";
import {txt} from "@shared/core/i18ngen";
import {rules} from "@shared/lib/form-rules/rules";
import {useActions} from "@shared/lib/hooks/useActions";
import {useTypedSelector} from "@shared/lib/hooks/useTypedSelector";

interface ModalAddProductProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<boolean>;
    sectionId: UUID;
    categoryId: UUID;
}

export const ModalAddProduct: FC<ModalAddProductProps> = ({isOpen, setIsOpen, sectionId, categoryId}) => {
    const {currentLang} = useTypedSelector(state => state.lang);
    const {catalog} = useTypedSelector(state => state.catalog);
    const {products} = useTypedSelector(state => state.products);
    const {setCatalog} = useActions();
    const [form] = useForm<{ productIds: string[] }>();

    const handleSubmit = () => {
        if (!catalog) return;
        const updatedStructure = catalog?.structure?.map(section => {
            if (section.sectionId === sectionId) {
                return {
                    sectionId: sectionId,
                    categories: section.categories.map(category => {
                        if (category.categoryId === categoryId) {
                            return {
                                categoryId: categoryId,
                                products: [
                                    ...(category.products || []),
                                    ...form.getFieldValue("productIds").map((productId: string) => ({
                                        productId: productId
                                    }))
                                ]
                            }
                        }
                        return category;
                    })
                }
            }
            return section;
        });
        setCatalog({...catalog, structure: updatedStructure,});
        setIsOpen(false);
    }

    return (
        <Modal
            title={txt.add_product_to_catalog[currentLang]}
            open={isOpen}
            onOk={form.submit}
            onCancel={() => setIsOpen(false)}
            okText={txt.ok[currentLang]}
            cancelText={txt.cancel[currentLang]}
        >
            <Form form={form} onFinish={handleSubmit} layout={"vertical"}>
                <Form.Item
                    name={"productIds"}
                    label={txt.select_product[currentLang]}
                    rules={[rules.required(txt.please_select_product[currentLang])]}
                >
                    <Select
                        placeholder={txt.select_product[currentLang]}
                        showSearch={true}
                        filterOption={(input, option) => option?.label?.toLowerCase()?.includes(input.toLowerCase()) || false}
                        filterSort={(optionA, optionB) => optionA.label.localeCompare(optionB.label)}
                        mode={"multiple"}
                        options={
                            products?.filter(product => {
                                const structureProductIds = catalog?.structure?.flatMap(section => section?.categories).flatMap(category => category?.products).map(product => product?.productId);
                                const promoProductIds = catalog?.promo?.flatMap(section => section?.categories).flatMap(category => category?.products).map(product => product?.productId);
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
