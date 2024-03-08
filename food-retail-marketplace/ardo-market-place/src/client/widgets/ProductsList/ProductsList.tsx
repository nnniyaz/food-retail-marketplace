import {useEffect, useState} from "react";
import PlusSVG from "@assets/icons/plus.svg?react";
import {Product} from "@domain/product/product.ts";
import {PublishedCatalogSections} from "@domain/catalog/catalog.ts";
import {translate} from "@pkg/translate/translate.ts";
import {priceFormat} from "@pkg/formats/price/priceFormat.ts";
import {useTypedSelector} from "@pkg/hooks/useTypedSelector.ts";
import classes from "./ProductsList.module.scss";

interface ProductsProps {
    sectionId: string;
    withCategoryBar: boolean;
}

export const ProductsList = ({sectionId, withCategoryBar = true}: ProductsProps) => {
    const {catalog} = useTypedSelector(state => state.catalogState);
    const [sectionStructure, setSectionStructure] = useState<PublishedCatalogSections | null>(null);

    useEffect(() => {
        if (!catalog) {
            return;
        }
        const sectionStructure = catalog.structure.find((section) => section.sectionId === sectionId);
        if (!sectionStructure) {
            return;
        }
        setSectionStructure(prev => ({...prev, ...sectionStructure}));
    }, []);

    if (!sectionStructure) {
        return null;
    }
    if (!catalog.sections[sectionStructure.sectionId]) {
        return null;
    }
    return (
        <div className={classes.products_widget}>
            {withCategoryBar && (
                <nav>Category Navigation</nav>
            )}
            <div className={classes.products}>
                {sectionStructure.categories.map((catalogsCategory) => {
                    if (!catalog.categories[catalogsCategory.categoryId]) {
                        return null;
                    }
                    return (
                        <section key={catalogsCategory.categoryId} className={classes.products__section}>
                            <h2>{translate(catalog.categories[catalogsCategory.categoryId].name)}</h2>
                            <ul className={classes.products__list}>
                                {catalogsCategory.products.map((catalogsProduct) => (
                                    <ProductItem
                                        key={catalogsProduct.productId}
                                        product={catalog.products[catalogsProduct.productId]}
                                    />
                                ))}
                            </ul>
                        </section>
                    )
                })}
            </div>
        </div>
    );
}

interface ProductProps {
    product: Product;
}

const ProductItem = ({product}: ProductProps) => {
    if (!product) {
        return null;
    }
    return (
        <li className={classes.product}>
            <img
                className={classes.product__img}
                src={product.img}
                alt={translate(product.name)}
                onError={(e) => {
                    e.currentTarget.src = "food_placeholder.png";
                }}
            />
            <div className={classes.product__info}>
                <p className={classes.product__title}>Bananas</p>
                <p className={classes.product__price_per_unit}>
                    <span className={classes.product__price_per_unit__price}>
                        {priceFormat(product.price)}
                    </span>
                    <span className={classes.product__price_per_unit__moq}>• 1 pc</span>
                </p>
                <p className={classes.product__total_price_of_product}>$30</p>
                <button className={classes.product__add}>
                    <span className={classes.product__add__text}>Add</span>
                    <PlusSVG className={classes.product__add__plus}/>
                </button>
            </div>
        </li>
    )
}
