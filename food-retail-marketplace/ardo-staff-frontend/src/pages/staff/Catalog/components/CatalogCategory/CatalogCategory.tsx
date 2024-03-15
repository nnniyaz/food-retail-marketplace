import React, {FC, useEffect, useMemo, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {Button, Collapse, Modal} from "antd";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import {RouteNames} from "@pages/index";
import {txt} from "@shared/core/i18ngen";
import {useActions} from "@shared/lib/hooks/useActions";
import {useTypedSelector} from "@shared/lib/hooks/useTypedSelector";
import {CatalogProduct} from "../CatalogProduct";
import {ModalAddProduct} from "../ModalAddProduct";
import classes from "../../Catalog.module.scss";

interface CatalogCategoryProps {
    sectionId: string;
    categoryStructure: {
        categoryId: string;
        products: { productId: string }[];
    };
    categoryIndex: number;
    catalogErrors: string[];
}

export const CatalogCategory: FC<CatalogCategoryProps> = (
    {sectionId, categoryStructure, categoryIndex, catalogErrors}
) => {
    const navigate = useNavigate();
    const {currentLang} = useTypedSelector(state => state.lang);
    const {catalog, isLoadingEditCatalog} = useTypedSelector(state => state.catalog);
    const {categories} = useTypedSelector(state => state.categories);
    const {editCatalog} = useActions();
    const [isError, setIsError] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [isAddProductModalVisible, setIsAddProductModalVisible] = useState(false);
    const category = useMemo(() => {
        return categories?.find(c => c.id === categoryStructure.categoryId);
    }, [categoryStructure.categoryId, categories]);

    const handleDelete = async () => {
        if (!catalog) return;
        await editCatalog({
            structure: [
                ...(catalog?.structure || []).map(section => {
                    return {
                        sectionId: section.sectionId,
                        categories: section.categories.filter(category => category.categoryId !== categoryStructure.categoryId)
                    }
                }),
            ],
            promo: [...(catalog?.promo || [])]
        }, catalog.id, {navigate: navigate});
        setIsDeleteModalVisible(false);
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
        <li key={categoryStructure.categoryId}>
            <Collapse
                style={{backgroundColor: !category?.name[currentLang] ? "#ff9494" : ""}}
                items={[
                    {
                        key: 1,
                        label: (
                            <div className={classes.list__item__title}>
                                {
                                    !!category?.name[currentLang]
                                        ? `${categoryIndex + 1}. ${category?.name[currentLang]}`
                                        : `${categoryIndex + 1}. ${txt.not_translated[currentLang]}`
                                }
                                {isError && <div className={classes.error__notification}></div>}
                                <Link to={RouteNames.CATEGORIES_EDIT.replace(":id", categoryStructure.categoryId)}>
                                    <EditOutlined/>
                                </Link>
                                <DeleteOutlined
                                    className={classes.delete__icon}
                                    onClick={() => setIsDeleteModalVisible(true)}
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

                                <ol>
                                    {categoryStructure?.products?.map((product, productIndex) => (
                                        <CatalogProduct
                                            key={product.productId}
                                            productId={product.productId}
                                            productIndex={productIndex}
                                            catalogErrors={catalogErrors}
                                        />
                                    ))}
                                </ol>
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
                confirmLoading={isLoadingEditCatalog}
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
            />
        </li>
    )
}
