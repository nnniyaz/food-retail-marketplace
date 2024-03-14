import React, {FC, useEffect, useMemo, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {Button, Card, Collapse, Modal} from "antd";
import {isEmpty} from "lodash";
import {txt} from "@shared/core/i18ngen";
import {useActions} from "@shared/lib/hooks/useActions";
import {useTypedSelector} from "@shared/lib/hooks/useTypedSelector";
import {CatalogSection} from "./components/CatalogSection";
import classes from "./Catalog.module.scss";
import {ModalAddSection} from "@pages/staff/Catalog/components/ModalAddSection/ModalAddSection";

export const Catalog: FC = () => {
    const navigate = useNavigate();
    const {currentLang} = useTypedSelector(state => state.lang);
    const {catalog, isLoadingGetCatalog} = useTypedSelector(state => state.catalog);
    const {sections, isLoadingGetSections} = useTypedSelector(state => state.sections);
    const {categories, isLoadingGetCategories} = useTypedSelector(state => state.categories);
    const {products, isLoadingGetProducts} = useTypedSelector(state => state.products);
    const {fetchCatalogs, fetchSections, fetchCategories, fetchProducts} = useActions();

    const [isAddSectionModalVisible, setIsAddSectionModalVisible] = useState(false);

    const catalogErrors = useMemo<string[]>(() => {
        const errors: string[] = [];
        if (!isEmpty(catalog?.structure)) {
            catalog?.structure.forEach(section => {
                const foundSection = sections?.find(s => s.id === section.sectionId);
                if (!foundSection || !foundSection.name[currentLang]) {
                    errors.push(section.sectionId);
                }
                section.categories?.forEach(category => {
                    const foundCategory = categories?.find(c => c.id === category.categoryId);
                    if (!foundCategory || !foundCategory.name[currentLang]) {
                        errors.push(category.categoryId);
                    }
                    category.products?.forEach(product => {
                        const foundProduct = products?.find(p => p.id === product.productId);
                        if (!foundProduct || !foundProduct.name[currentLang]) {
                            errors.push(product.productId);
                        }
                    });
                });
            });
        }
        return errors.filter((value, index, self) => self.indexOf(value) === index);
    }, [catalog, sections, categories, products, currentLang]);

    useEffect(() => {
        const controller = new AbortController();
        fetchCatalogs({offset: 0, limit: 0}, controller, {navigate: navigate});
        return () => controller.abort();
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        fetchSections({offset: 0, limit: 0}, controller, {navigate: navigate});
        return () => controller.abort();
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        fetchCategories({offset: 0, limit: 0}, controller, {navigate: navigate});
        return () => controller.abort();
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        fetchProducts({offset: 0, limit: 0}, controller, {navigate: navigate});
        return () => controller.abort();
    }, []);

    return (
        <div className={classes.main}>
            <Card
                title={txt.catalog_order[currentLang]}
                bodyStyle={{padding: "20px", borderRadius: "8px"}}
                loading={isLoadingGetCatalog || isLoadingGetSections || isLoadingGetCategories || isLoadingGetProducts}
            >
                {isEmpty(catalog?.structure) ? (
                    <></>
                ) : (
                    <div className={classes.catalog__preview}>
                        <div>
                            {`Catalogs error: ${catalogErrors.length}`}
                        </div>

                        <div className={classes.catalog__preview__content}>
                            <h3>{`${txt.sections[currentLang]}:`}</h3>

                            <Button
                                type={"primary"}
                                style={{width: "fit-content"}}
                                onClick={() => setIsAddSectionModalVisible(true)}
                            >
                                {txt.add_section_to_catalog[currentLang]}
                            </Button>

                            <ol className={classes.catalog} style={{padding: "0"}}>
                                {catalog?.structure?.map((section, sectionIndex) => (
                                    <CatalogSection
                                        key={section.sectionId}
                                        sectionStructure={section}
                                        sectionIndex={sectionIndex}
                                        catalogErrors={catalogErrors}
                                    />
                                ))}
                            </ol>
                        </div>
                    </div>
                )}
            </Card>

            <ModalAddSection isOpen={isAddSectionModalVisible} setIsOpen={setIsAddSectionModalVisible}/>
        </div>
    )
}
