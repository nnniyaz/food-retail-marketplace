import React, {FC, useEffect, useMemo} from "react";
import {useNavigate} from "react-router-dom";
import {Card} from "antd";
import {isEmpty} from "lodash";
import {txt} from "@shared/core/i18ngen";
import {useActions} from "@shared/lib/hooks/useActions";
import {useTypedSelector} from "@shared/lib/hooks/useTypedSelector";
import classes from "./Catalog.module.scss";
import {CatalogsStructure} from "@entities/catalog/catalog";
import {Section} from "@entities/section/section";

export const Catalog: FC = () => {
    const navigate = useNavigate();
    const {currentLang} = useTypedSelector(state => state.lang);
    const {catalog, isLoadingGetCatalog} = useTypedSelector(state => state.catalog);
    const {sections, isLoadingGetSections} = useTypedSelector(state => state.sections);
    const {categories, isLoadingGetCategories} = useTypedSelector(state => state.categories);
    const {products, isLoadingGetProducts} = useTypedSelector(state => state.products);
    const {fetchCatalogs, fetchSections, fetchCategories, fetchProducts} = useActions();

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
                bodyStyle={{padding: "20px 10px", borderRadius: "8px"}}
                loading={isLoadingGetCatalog || isLoadingGetSections || isLoadingGetCategories || isLoadingGetProducts}
            >
                {isEmpty(catalog?.structure) ? (
                    <></>
                ) : (
                    <ol className={classes.catalog} style={{padding: "0"}}>
                        {catalog?.structure.map((section, sectionIndex) => (

                        ))}
                    </ol>
                )}
            </Card>
        </div>
    )
}

interface CatalogSectionProps {
    sectionStructure: {
        sectionId: string;
        categories: { categoryId: string, products: { productId: number }[] }[];
    };
    sectionIndex: number;
}

const CatalogSection: FC<CatalogSectionProps> = ({sectionStructure, sectionIndex}) => {
    const {currentLang} = useTypedSelector(state => state.lang);
    const {sections} = useTypedSelector(state => state.sections);
    return (
        <li key={sectionStructure.sectionId}>
            <div className={classes.catalog__item}>
                {`${sectionIndex + 1}. ${sections?.find(s => s.id === sectionStructure.sectionId)?.name[currentLang] || txt.not_translated[currentLang]}`}
            </div>
            <ol>
                {sectionStructure?.categories.map((category, categoryIndex) => (

                ))}
            </ol>
        </li>
    )
}

interface CatalogCategoryProps {
    categoryStructure: {
        categoryId: string;
        products: { productId: string }[];
    };
    categoryIndex: number;
}

const CatalogCategory: FC<CatalogCategoryProps> = ({categoryStructure, categoryIndex}) => {
    const {currentLang} = useTypedSelector(state => state.lang);
    const {categories} = useTypedSelector(state => state.categories);
    return (
        <li key={categoryStructure.categoryId}>
            <div className={classes.catalog__item}>
                {`${categoryIndex + 1}. ${categories?.find(c => c.id === categoryStructure.categoryId)?.name[currentLang] || txt.not_translated[currentLang]}`}
            </div>
            <ol>
                {categoryStructure?.products.map((product, productIndex) => (
                    <li key={product.productId}>
                        <div className={classes.catalog__item}>
                            {`${productIndex + 1}. ${products?.find(p => p.id === product.productId)?.name[currentLang] || txt.not_translated[currentLang]}`}
                        </div>
                    </li>
                ))}
            </ol>
        </li>
    )
}

interface CatalogProductProps {
    productId: string;
    productIndex: number;
}

const CatalogProduct: FC<CatalogProductProps> = ({productId, productIndex}) => {
    const {currentLang} = useTypedSelector(state => state.lang);
    const {products} = useTypedSelector(state => state.products);
    const product = useMemo(() => {
        return products?.find(p => p.id === productId);
    }, [productId, products]);

    return (
        <li>
            <div className={classes.catalog__item}>
                {
                    !!product?.name[currentLang]
                        ? `${productIndex + 1}. ${product?.name[currentLang]}`
                        : <span className={classes.catalog__item__wrong}>txt.not_translated[currentLang]</span>
                }
            </div>
        </li>
    )
}
