import React, {FC, useEffect, useMemo, useState} from "react";
import {Link} from "react-router-dom";
import {Reorder, useDragControls} from "framer-motion";
import {Button, Collapse, Modal} from "antd";
import {DeleteOutlined, EditOutlined, HolderOutlined} from "@ant-design/icons";
import {RouteNames} from "@pages/index";
import {CatalogsCategory, CatalogsProduct} from "@entities/catalog/catalog";
import {txt} from "@shared/core/i18ngen";
import {useActions} from "@shared/lib/hooks/useActions";
import {useTypedSelector} from "@shared/lib/hooks/useTypedSelector";
import {CatalogProduct} from "../CatalogProduct";
import {ModalAddProduct} from "../ModalAddProduct";
import classes from "../../Catalog.module.scss";

interface CatalogCategoryProps {
    sectionId: string;
    categoryStructure: CatalogsCategory;
    categoryIndex: number;
    catalogErrors: string[];
    isPromo?: boolean;
}

export const CatalogCategory: FC<CatalogCategoryProps> = (
    {sectionId, categoryStructure, categoryIndex, catalogErrors, isPromo}
) => {
    const {currentLang} = useTypedSelector(state => state.lang);
    const {catalog} = useTypedSelector(state => state.catalog);
    const {categories} = useTypedSelector(state => state.categories);
    const {setCatalog} = useActions();
    const controls = useDragControls();
    const [isError, setIsError] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [isAddProductModalVisible, setIsAddProductModalVisible] = useState(false);
    const category = useMemo(() => {
        return categories?.find(c => c.id === categoryStructure.categoryId);
    }, [categoryStructure.categoryId, categories]);

    const handleDelete = () => {
        if (!catalog) return;
        if (isPromo) {
            setCatalog({
                ...catalog,
                promo: [
                    ...(catalog?.promo || []).map(section => {
                        return {
                            sectionId: section.sectionId,
                            categories: section.categories?.filter(category => category.categoryId !== categoryStructure.categoryId)
                        }
                    }),
                ],
            });
        } else {
            setCatalog({
                ...catalog,
                structure: [
                    ...(catalog?.structure || []).map(section => {
                        return {
                            sectionId: section.sectionId,
                            categories: section.categories?.filter(category => category.categoryId !== categoryStructure.categoryId)
                        }
                    }),
                ],
            });
        }
        setIsDeleteModalVisible(false);
    }

    const handleSetCatalogStructure = (newStructure: CatalogsProduct[]) => {
        if (!catalog) return;
        if (isPromo) {
            setCatalog({
                ...catalog,
                promo: [
                    ...(catalog?.promo || []).map(section => {
                        if (section.sectionId === sectionId) {
                            return {
                                sectionId: section.sectionId,
                                categories: section.categories.map(category => {
                                    if (category.categoryId === categoryStructure.categoryId) {
                                        return {
                                            categoryId: category.categoryId,
                                            products: newStructure
                                        }
                                    }
                                    return category;
                                })
                            }
                        }
                        return section;
                    }),
                ],
            });
        } else {
            setCatalog({
                ...catalog,
                structure: [
                    ...(catalog?.structure || []).map(section => {
                        if (section.sectionId === sectionId) {
                            return {
                                sectionId: section.sectionId,
                                categories: section.categories.map(category => {
                                    if (category.categoryId === categoryStructure.categoryId) {
                                        return {
                                            categoryId: category.categoryId,
                                            products: newStructure
                                        }
                                    }
                                    return category;
                                })
                            }
                        }
                        return section;
                    }),
                ],
            });
        }
    }

    useEffect(() => {
        if (catalogErrors.includes(categoryStructure.categoryId)) {
            setIsError(true);
        } else {
            categoryStructure.products?.forEach(product => {
                if (catalogErrors.includes(product.productId)) {
                    setIsError(true);
                }
            });
        }
    }, [catalogErrors, categoryStructure]);

    return (
        <Reorder.Item value={categoryStructure} dragListener={false} dragControls={controls}>
            <Collapse
                collapsible={"icon"}
                style={{backgroundColor: !category?.name[currentLang] ? "#ff9494" : ""}}
                items={[
                    {
                        key: 1,
                        label: (
                            <div className={classes.list__item__title}>
                                <div className={classes.list__item__title__group}>
                                    {
                                        !!category?.name[currentLang]
                                            ? `${categoryIndex + 1}. ${category?.name[currentLang]}`
                                            : `${categoryIndex + 1}. ${txt.not_translated[currentLang]}`
                                    }
                                    {isError && <div className={classes.error__notification}></div>}
                                    <Link
                                        to={RouteNames.CATEGORIES_EDIT.replace(":id", categoryStructure.categoryId)}>
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
                        ),
                        style: {
                            backgroundColor: !category?.name[currentLang] ? "#ff9494" : "",
                            borderRadius: "7px"
                        },
                        children: (
                            <div className={classes.catalog__preview__content}>
                                <h3>{`${txt.products[currentLang]}:`}</h3>

                                <Button
                                    type={"primary"}
                                    style={{width: "fit-content"}}
                                    onClick={() => setIsAddProductModalVisible(true)}
                                >
                                    {txt.add_product_to_catalog[currentLang]}
                                </Button>

                                <Reorder.Group
                                    as={"ol"}
                                    values={categoryStructure?.products || []}
                                    onReorder={handleSetCatalogStructure}
                                >
                                    {categoryStructure?.products?.map((product, productIndex) => (
                                        <CatalogProduct
                                            key={product.productId}
                                            productStructure={product}
                                            productIndex={productIndex}
                                            catalogErrors={catalogErrors}
                                            isPromo={isPromo}
                                        />
                                    ))}
                                </Reorder.Group>
                            </div>
                        )
                    },
                ]}
            />

            <Modal
                title={txt.delete[currentLang]}
                open={isDeleteModalVisible}
                onOk={handleDelete}
                onCancel={() => setIsDeleteModalVisible(false)}
                okText={txt.ok[currentLang]}
                cancelText={txt.cancel[currentLang]}
            >
                {txt.are_you_sure_that_you_want_to_delete_category_from_catalog[currentLang]}
            </Modal>

            <ModalAddProduct
                isOpen={isAddProductModalVisible}
                setIsOpen={setIsAddProductModalVisible}
                sectionId={sectionId}
                categoryId={category?.id || ""}
                isPromo={isPromo}
            />
        </Reorder.Item>
    )
}
