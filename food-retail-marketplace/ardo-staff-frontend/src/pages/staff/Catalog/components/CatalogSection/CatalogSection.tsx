import React, {FC, useEffect, useMemo, useState} from "react";
import {Link} from "react-router-dom";
import {Reorder, useDragControls} from "framer-motion";
import {Button, Collapse, Modal} from "antd";
import {DeleteOutlined, EditOutlined, HolderOutlined} from "@ant-design/icons";
import {RouteNames} from "@pages/index";
import {CatalogsCategory} from "@entities/catalog/catalog";
import {txt} from "@shared/core/i18ngen";
import {useActions} from "@shared/lib/hooks/useActions";
import {useTypedSelector} from "@shared/lib/hooks/useTypedSelector";
import {CatalogCategory} from "../CatalogCategory";
import {ModalAddCategory} from "../ModalAddCategory";
import classes from "../../Catalog.module.scss";

interface CatalogSectionProps {
    sectionStructure: {
        sectionId: string;
        categories: {
            categoryId: string,
            products: { productId: string }[]
        }[];
    };
    sectionIndex: number;
    catalogErrors: string[];
    isPromo?: boolean;
}

export const CatalogSection: FC<CatalogSectionProps> = (
    {sectionStructure, sectionIndex, catalogErrors, isPromo}
) => {
    const {currentLang} = useTypedSelector(state => state.lang);
    const {catalog} = useTypedSelector(state => state.catalog);
    const {sections} = useTypedSelector(state => state.sections);
    const {setCatalog} = useActions();
    const controls = useDragControls();
    const [isError, setIsError] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [isAddCategoryModalVisible, setIsAddCategoryModalVisible] = useState(false);
    const section = useMemo(() => {
        return sections?.find(s => s.id === sectionStructure.sectionId);
    }, [sectionStructure.sectionId, sections]);

    const handleDelete = () => {
        if (!catalog) return;

        if (isPromo) {
            setCatalog({
                ...catalog,
                promo: [
                    ...(catalog?.promo || []).filter(p => p.sectionId !== sectionStructure.sectionId),
                ],
            });
        } else {
            setCatalog({
                ...catalog,
                structure: [
                    ...(catalog?.structure || []).filter(s => s.sectionId !== sectionStructure.sectionId),
                ],
            });
        }
        setIsDeleteModalVisible(false);
    }

    const handleSetCatalogStructure = (newStructure: CatalogsCategory[]) => {
        if (!catalog) return;
        if (isPromo) {
            setCatalog({
                ...catalog,
                promo: [
                    ...(catalog?.promo || []).map(s => {
                        if (s.sectionId === sectionStructure.sectionId) {
                            return {
                                sectionId: s.sectionId,
                                categories: newStructure
                            }
                        }
                        return s;
                    }),
                ],
            });
        } else {
            setCatalog({
                ...catalog,
                structure: [
                    ...(catalog?.structure || []).map(s => {
                        if (s.sectionId === sectionStructure.sectionId) {
                            return {
                                sectionId: s.sectionId,
                                categories: newStructure
                            }
                        }
                        return s;
                    }),
                ],
            });
        }
    }

    useEffect(() => {
        if (catalogErrors.includes(sectionStructure.sectionId)) {
            setIsError(true);
        } else {
            sectionStructure.categories?.forEach(category => {
                if (catalogErrors.includes(category.categoryId)) {
                    setIsError(true);
                } else {
                    category.products?.forEach(product => {
                        if (catalogErrors.includes(product.productId)) {
                            setIsError(true);
                        }
                    });
                }
            });
        }
    }, [catalogErrors, sectionStructure]);

    return (
        <Reorder.Item value={sectionStructure} dragListener={false} dragControls={controls}>
            <Collapse
                collapsible={"icon"}
                style={{backgroundColor: !section?.name[currentLang] ? "#ff9494" : ""}}
                items={[
                    {
                        key: 1,
                        label: (
                            <div className={classes.list__item__title}>
                                <div className={classes.list__item__title__group}>
                                    {
                                        !!section?.name[currentLang]
                                            ? `${sectionIndex + 1}. ${section?.name[currentLang]}`
                                            : `${sectionIndex + 1}. ${txt.not_translated[currentLang]}`
                                    }
                                    {isError && <div className={classes.error__notification}></div>}
                                    <Link to={RouteNames.SECTIONS_EDIT.replace(":id", sectionStructure.sectionId)}>
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
                            backgroundColor: !section?.name[currentLang] ? "#ff9494" : "",
                            borderRadius: "7px"
                        },
                        children: (
                            <div className={classes.catalog__preview__content}>
                                <h3>{`${txt.categories[currentLang]}:`}</h3>

                                <Button
                                    type={"primary"}
                                    style={{width: "fit-content"}}
                                    onClick={() => setIsAddCategoryModalVisible(true)}
                                >
                                    {txt.add_category_to_catalog[currentLang]}
                                </Button>

                                <Reorder.Group
                                    as={"ol"}
                                    values={sectionStructure?.categories || []}
                                    onReorder={handleSetCatalogStructure}
                                >
                                    {sectionStructure?.categories?.map((category, categoryIndex) => (
                                        <CatalogCategory
                                            key={category.categoryId}
                                            sectionId={sectionStructure.sectionId}
                                            categoryStructure={category}
                                            categoryIndex={categoryIndex}
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
                {txt.are_you_sure_that_you_want_to_delete_section_from_catalog[currentLang]}
            </Modal>

            <ModalAddCategory
                isOpen={isAddCategoryModalVisible}
                setIsOpen={setIsAddCategoryModalVisible}
                sectionId={section?.id || ""}
                isPromo={isPromo}
            />
        </Reorder.Item>
    )
}
