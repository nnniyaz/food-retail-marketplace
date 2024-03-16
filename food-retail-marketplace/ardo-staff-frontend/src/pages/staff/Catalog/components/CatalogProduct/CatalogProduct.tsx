import React, {FC, useMemo, useState} from "react";
import {Link} from "react-router-dom";
import {Modal} from "antd";
import {DeleteOutlined, EditOutlined, HolderOutlined} from "@ant-design/icons";
import {Reorder, useDragControls} from "framer-motion";
import {RouteNames} from "@pages/index";
import {CatalogsProduct} from "@entities/catalog/catalog";
import {txt} from "@shared/core/i18ngen";
import {useActions} from "@shared/lib/hooks/useActions";
import {useTypedSelector} from "@shared/lib/hooks/useTypedSelector";
import classes from "../../Catalog.module.scss";

interface CatalogProductProps {
    productStructure: CatalogsProduct;
    productIndex: number;
    catalogErrors: string[];
}

export const CatalogProduct: FC<CatalogProductProps> = ({productStructure, productIndex}) => {
    const {currentLang} = useTypedSelector(state => state.lang);
    const {catalog} = useTypedSelector(state => state.catalog);
    const {products} = useTypedSelector(state => state.products);
    const {setCatalog} = useActions();
    const controls = useDragControls();
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const product = useMemo(() => {
        return products?.find(p => p.id === productStructure.productId);
    }, [productStructure, products]);

    const handleDelete = () => {
        if (!catalog) return;
        setCatalog({
            ...catalog,
            structure: [
                ...(catalog?.structure || []).map(section => {
                    return {
                        sectionId: section.sectionId,
                        categories: section.categories.map(category => {
                            return {
                                categoryId: category.categoryId,
                                products: category.products.filter(product => product.productId !== productStructure.productId)
                            }
                        })
                    }
                }),
            ],
        });
        setIsDeleteModalVisible(false);
    }

    return (
        <Reorder.Item value={productStructure} dragListener={false} dragControls={controls}>
            <div className={classes.catalog__item}
                 style={{backgroundColor: !!product?.name[currentLang] ? "" : "#ff9494"}}>
                <div className={classes.list__item__title}>
                    <div className={classes.list__item__title__group}>
                        {`${productIndex + 1}. ${!!product?.name[currentLang] ? product?.name[currentLang] : txt.not_translated[currentLang]}`}
                        <Link to={RouteNames.PRODUCTS_EDIT.replace(":id", productStructure.productId)}>
                            <EditOutlined/>
                        </Link>
                        <DeleteOutlined
                            className={classes.delete__icon}
                            onClick={() => setIsDeleteModalVisible(true)}
                        />
                    </div>
                    <HolderOutlined
                        className={classes.list__item__title__holder}
                        onPointerDown={(e) => controls.start(e)}
                    />
                </div>
            </div>

            <Modal
                title={txt.delete[currentLang]}
                open={isDeleteModalVisible}
                onOk={handleDelete}
                onCancel={() => setIsDeleteModalVisible(false)}
                okText={txt.ok[currentLang]}
                cancelText={txt.cancel[currentLang]}
            >
                {txt.are_you_sure_that_you_want_to_delete_product_from_catalog[currentLang]}
            </Modal>
        </Reorder.Item>
    )
}
