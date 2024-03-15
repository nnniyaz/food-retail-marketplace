import React, {FC, useEffect, useMemo, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {Button, Collapse, Modal} from "antd";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import {RouteNames} from "@pages/index";
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
}

export const CatalogSection: FC<CatalogSectionProps> = ({sectionStructure, sectionIndex, catalogErrors}) => {
    const navigate = useNavigate();
    const {currentLang} = useTypedSelector(state => state.lang);
    const {catalog, isLoadingEditCatalog} = useTypedSelector(state => state.catalog);
    const {sections} = useTypedSelector(state => state.sections);
    const {editCatalog} = useActions();
    const [isError, setIsError] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [isAddCategoryModalVisible, setIsAddCategoryModalVisible] = useState(false);
    const section = useMemo(() => {
        return sections?.find(s => s.id === sectionStructure.sectionId);
    }, [sectionStructure.sectionId, sections]);

    const handleDelete = async () => {
        if (!catalog) return;
        await editCatalog({
            structure: [
                ...(catalog?.structure || []).filter(s => s.sectionId !== sectionStructure.sectionId),
            ],
            promo: [...(catalog?.promo || [])]
        }, catalog.id, {navigate: navigate});
        setIsDeleteModalVisible(false);
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
        <li key={sectionStructure.sectionId}>
            <Collapse
                style={{backgroundColor: !section?.name[currentLang] ? "#ff9494" : ""}}
                items={[
                    {
                        key: 1,
                        label: (
                            <div className={classes.list__item__title}>
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

                                <ol>
                                    {sectionStructure?.categories?.map((category, categoryIndex) => (
                                        <CatalogCategory
                                            key={category.categoryId}
                                            sectionId={sectionStructure.sectionId}
                                            categoryStructure={category}
                                            categoryIndex={categoryIndex}
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
                {txt.are_you_sure_that_you_want_to_delete_section_from_catalog[currentLang]}
            </Modal>

            <ModalAddCategory
                isOpen={isAddCategoryModalVisible}
                setIsOpen={setIsAddCategoryModalVisible}
                sectionId={section?.id || ""}
            />
        </li>
    )
}
