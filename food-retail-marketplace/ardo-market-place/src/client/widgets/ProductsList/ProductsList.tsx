import React, {useEffect, useMemo, useState} from "react";
import PlusSVG from "@assets/icons/plus-circle.svg?react";
import MinusSVG from "@assets/icons/minus-circle.svg?react";
import {Product} from "@domain/product/product.ts";
import {PublishedCatalogSections} from "@domain/catalog/catalog.ts";
import {translate} from "@pkg/translate/translate";
import {priceFormat} from "@pkg/formats/price/priceFormat.ts";
import {useTypedSelector} from "@pkg/hooks/useTypedSelector.ts";
import {useActions} from "@pkg/hooks/useActions.ts";
import classes from "./ProductsList.module.scss";
import {Drawer} from "antd";
import {useLocation} from "react-router-dom";

interface ProductsProps {
    sectionId: string;
    isPromo?: boolean;
}

export const ProductsList = ({sectionId, isPromo}: ProductsProps) => {
    const location = useLocation();
    const {currentLang, langs} = useTypedSelector(state => state.systemState);
    const {catalog, currentCategory} = useTypedSelector(state => state.catalogState);
    const sectionStructure = useMemo<PublishedCatalogSections | null>(() => {
        if (!catalog) {
            return null;
        }
        let foundSectionStructure: PublishedCatalogSections;
        if (isPromo) {
            foundSectionStructure = catalog.promo.find((section) => section.sectionId === sectionId);
        } else {
            foundSectionStructure = catalog.structure.find((section) => section.sectionId === sectionId);
        }
        if (!foundSectionStructure) {
            return null;
        }
        return foundSectionStructure;
    }, [sectionId, catalog.structure]);

    const scrollTo = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({behavior: "smooth"});
        }
    }

    useEffect(() => {
        if (!!catalog.categories[currentCategory.categoryId]) {
            scrollTo(location.hash.replace("#", ""));
        }
    }, [location.hash]);

    if (!sectionStructure) {
        return null;
    }
    if (!catalog.sections[sectionStructure.sectionId]) {
        return null;
    }
    return (
        <div className={classes.products_widget}>
            <div className={classes.products}>
                {sectionStructure.categories.map((catalogsCategory) => {
                    if (!catalog.categories[catalogsCategory.categoryId]) {
                        return null;
                    }
                    return (
                        <section
                            key={catalogsCategory.categoryId}
                            className={classes.products__category}
                            id={translate(catalog.categories[catalogsCategory.categoryId].name, currentLang, langs).toLowerCase().replace(/ /g, "_")}
                        >
                            <h2>{translate(catalog.categories[catalogsCategory.categoryId].name, currentLang, langs)}</h2>
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

export interface ProductProps {
    product: Product;
}

export const ProductItem = ({product}: ProductProps) => {
    const {cfg, currentLang, langs, currency} = useTypedSelector(state => state.systemState);
    const {cart} = useTypedSelector(state => state.cartState);
    const {incrementToCart, decrementFromCart} = useActions();
    const [imgError, setImgError] = useState(false);
    const cartProduct = useMemo(() => {
        if (!product) {
            return null;
        }
        return cart.find((cartProduct) => cartProduct.id === product._id) || null;
    }, [cart]);
    const [openDrawer, setOpenDrawer] = useState(false);

    const handleIncrementToCart = () => {
        if (cartProduct?.quantity === product.quantity) {
            return;
        }
        incrementToCart({id: product._id, name: product.name, price: product.price});
    }

    const handleDecrementFromCart = () => {
        decrementFromCart(product._id);
    }

    if (!product) {
        return null;
    }
    return (
        <React.Fragment>
            <li className={classes.product} onClick={() => setOpenDrawer(true)}>
                <div className={classes.product__img__container}>
                    <img
                        className={classes.product__img}
                        src={`${cfg.assetsUri}/products/${product.img}`}
                        title={translate(product.name, currentLang, langs)}
                        alt={translate(product.name, currentLang, langs)}
                        onError={(e) => {
                            if (!imgError) {
                                e.currentTarget.src = `/food_placeholder.png`;
                                setImgError(true);
                            }
                        }}
                    />
                    {!!product?.tags?.length && (
                        <div className={classes.product__tags}>
                            {product.tags.map((tag, index) => (
                                <span key={index} className={classes.product__tag}>{tag}</span>
                            ))}
                        </div>
                    )}
                </div>
                <div className={classes.product__info}>
                    <p className={classes.product__title}>
                        {
                            translate(product.name, currentLang, langs).length > 30
                                ? translate(product.name, currentLang, langs).slice(0, 30) + "..."
                                : translate(product.name, currentLang, langs)
                        }
                    </p>
                    <p className={classes.product_available__amount}>
                        {translate("available_amount", currentLang, langs)}: {product.quantity}
                    </p>
                    <p className={classes.product__price_per_unit}>
                        {!!product?.originalPrice && (
                            <span
                                className={classes.product__price_per_unit__price}
                                style={{textDecoration: !!product?.originalPrice ? "line-through" : ""}}
                            >
                                {priceFormat(product.originalPrice, currency)}
                        </span>
                        )}
                        <span
                            className={classes.product__price_per_unit__price}
                            style={{color: !!product?.originalPrice ? "#4096ff" : ""}}
                        >
                        {priceFormat(product.price, currency)}
                    </span>
                        <span className={classes.product__price_per_unit__moq}>
                        {!cartProduct && `• 1 ${product.unit || "pc"}`}
                    </span>
                    </p>
                    <p className={classes.product__total_price_of_product}>
                        {
                            !!cartProduct
                                ? priceFormat(product.price * cartProduct.quantity, currency)
                                : priceFormat(product.price, currency)
                        }
                    </p>
                    <button
                        className={classes.product__add}
                        onClick={(e) => {
                            e.stopPropagation();
                            if (!cartProduct) {
                                handleIncrementToCart();
                            }
                        }}
                    >
                        {!!cartProduct && (
                            <MinusSVG className={classes.product__add__icon} onClick={handleDecrementFromCart}/>
                        )}
                        <span
                            className={classes.product__add__text}
                            style={{width: cartProduct?.quantity ? "fit-content" : ""}}
                        >
                        {cartProduct?.quantity ?? translate("add", currentLang, langs)}
                    </span>
                        {!!cartProduct && (
                            <PlusSVG className={classes.product__add__icon} onClick={handleIncrementToCart}/>
                        )}
                    </button>
                </div>
            </li>
            <ProductItemDrawer product={product} openDrawer={openDrawer} setOpenDrawer={setOpenDrawer}/>
        </React.Fragment>
    )
}

export interface ProductItemDrawerProps {
    product: Product;
    openDrawer: boolean;
    setOpenDrawer: (open: boolean) => void;
}

export const ProductItemDrawer = ({product, openDrawer, setOpenDrawer}: ProductItemDrawerProps) => {
    const {cfg, currentLang, langs, currency} = useTypedSelector(state => state.systemState);
    const {cart} = useTypedSelector(state => state.cartState);
    const {incrementToCart} = useActions();
    const cartProduct = useMemo(() => {
        if (!product) {
            return null;
        }
        return cart.find((cartProduct) => cartProduct.id === product._id) || null;
    }, [cart]);
    const [imgError, setImgError] = useState(false);

    const handleIncrementToCart = () => {
        if (cartProduct?.quantity === product.quantity) {
            return;
        }
        incrementToCart({id: product._id, name: product.name, price: product.price});
    }

    return (
        <Drawer open={openDrawer} onClose={() => setOpenDrawer(false)} styles={{body: {padding: "12px"}}}>
            <div className={classes.product_drawer}>
                <div className={classes.product_drawer__img__container}>
                    <img
                        className={classes.product_drawer__img}
                        src={`${cfg.assetsUri}/products/${product.img}`}
                        title={translate(product.name, currentLang, langs)}
                        alt={translate(product.name, currentLang, langs)}
                        onError={(e) => {
                            if (!imgError) {
                                e.currentTarget.src = `/food_placeholder.png`;
                                setImgError(true);
                            }
                        }}
                    />
                    {!!product?.tags?.length && (
                        <div className={classes.product_drawer__tags}>
                            {product.tags.map((tag, index) => (
                                <span key={index} className={classes.product_drawer__tag}>{tag}</span>
                            ))}
                        </div>
                    )}
                </div>
                <div className={classes.product_drawer__info}>
                    <p className={classes.product_drawer__title}>
                        {translate(product.name, currentLang, langs)}
                    </p>
                    <p className={classes.product_drawer__desc}>
                        {translate(product.desc, currentLang, langs)}
                    </p>
                    <p className={classes.product_drawer__price_per_unit}>
                        {!!product?.originalPrice && (
                            <span
                                className={classes.product_drawer__price_per_unit__price}
                                style={{textDecoration: !!product?.originalPrice ? "line-through" : ""}}
                            >
                                    {priceFormat(product.originalPrice, currency)}
                                </span>
                        )}
                        <span
                            className={classes.product_drawer__price_per_unit__price}
                            style={{color: !!product?.originalPrice ? "#4096ff" : ""}}
                        >
                                {priceFormat(product.price, currency)}
                            </span>
                        <span className={classes.product_drawer__price_per_unit__moq}>
                                {!cartProduct && `• 1 ${product.unit || "pc"}`}
                            </span>
                    </p>
                    <p className={classes.product_drawer__total_price_of_product}>
                        {
                            !!cartProduct
                                ? priceFormat(product.price * cartProduct.quantity, currency)
                                : priceFormat(product.price, currency)
                        }
                    </p>
                    <p className={classes.product_drawer_available__amount}>
                        {translate("available_amount", currentLang, langs)}: {product.quantity}
                    </p>
                    <p className={classes.product_drawer_available__amount}>
                        {translate("unit", currentLang, langs)}: {product.unit || "-"}
                    </p>
                    <p className={classes.product_drawer_available__amount}>
                        {translate("moq", currentLang, langs).toUpperCase()}: {product.moq || "-"}
                    </p>
                    <p className={classes.product_drawer_available__amount}>
                        {translate("cutOffTime", currentLang, langs)}: {product.cutOffTime || "-"}
                    </p>
                    <button
                        className={classes.product_drawer__add}
                        onClick={handleIncrementToCart}
                    >
                        <span className={classes.product_drawer__add__text}>
                            {translate("add", currentLang, langs)}
                        </span>
                    </button>
                </div>
            </div>
        </Drawer>
    )
}
