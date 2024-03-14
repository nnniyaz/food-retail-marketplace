import React, {FC, useMemo, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {RouteNames} from "@pages/index";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import {txt} from "@shared/core/i18ngen";
import {useActions} from "@shared/lib/hooks/useActions";
import {useTypedSelector} from "@shared/lib/hooks/useTypedSelector";
import classes from "../../Catalog.module.scss";
import {Modal} from "antd";

interface CatalogProductProps {
    productId: string;
    productIndex: number;
    catalogErrors: string[];
}

export const CatalogProduct: FC<CatalogProductProps> = ({productId, productIndex, catalogErrors}) => {
    const navigate = useNavigate();
    const {currentLang} = useTypedSelector(state => state.lang);
    const {catalog, isLoadingEditCatalog} = useTypedSelector(state => state.catalog);
    const {editCatalog} = useActions();
    const {products} = useTypedSelector(state => state.products);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const product = useMemo(() => {
        return products?.find(p => p.id === productId);
    }, [productId, products]);

    const handleDelete = async () => {
        if (!catalog) return;
        await editCatalog({
            structure: [
                ...(catalog?.structure || []).map(section => {
                    return {
                        sectionId: section.sectionId,
                        categories: section.categories.map(category => {
                            return {
                                categoryId: category.categoryId,
                                products: category.products.filter(product => product.productId !== productId)
                            }
                        })
                    }
                }),
            ],
            promo: [...(catalog?.promo || [])]
        }, catalog.id, {navigate: navigate});
        setIsDeleteModalVisible(false);
    }

    return (
        <li>
            <div className={classes.catalog__item} style={{backgroundColor: !!product?.name[currentLang] ? "" : "#ff9494"}}>
                <div className={classes.list__item__title}>
                    {`${productIndex + 1}. ${!!product?.name[currentLang] ? product?.name[currentLang] : txt.not_translated[currentLang]}`}
                    <Link to={RouteNames.PRODUCTS_EDIT.replace(":id", productId)}>
                        <EditOutlined/>
                    </Link>
                    <DeleteOutlined
                        className={classes.delete__icon}
                        onClick={() => setIsDeleteModalVisible(true)}
                    />
                </div>
            </div>

            <Modal
                title={txt.delete[currentLang]}
                open={isDeleteModalVisible}
                onOk={handleDelete}
                onCancel={() => setIsDeleteModalVisible(false)}
                confirmLoading={isLoadingEditCatalog}
                okText={txt.ok[currentLang]}
                cancelText={txt.cancel[currentLang]}
            >
                {txt.are_you_sure_that_you_want_to_delete_product_from_catalog[currentLang]}
            </Modal>
        </li>
    )
}
