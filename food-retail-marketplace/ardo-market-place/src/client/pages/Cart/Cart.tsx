import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import * as AntdIcons from "@ant-design/icons";
import {RouteNames} from "@pages/index.tsx";
import PlusSVG from "@assets/icons/plus-circle.svg?react";
import MinusSVG from "@assets/icons/minus-circle.svg?react";
import CrossSVG from "@assets/icons/cross.svg?react";
import {CartItem} from "@domain/cartItem";
import {translate} from "@pkg/translate/translate";
import {useActions} from "@pkg/hooks/useActions.ts";
import {priceFormat} from "@pkg/formats/price/priceFormat.ts";
import {cartPrice, cartTotalPrice} from "@pkg/cartPrice/cartPrice.tsx";
import {useTypedSelector} from "@pkg/hooks/useTypedSelector.ts";
import classes from "./Cart.module.scss";

const {ShoppingCartOutlined} = AntdIcons;

export const Cart = () => {
    const {currentLang, langs, currency} = useTypedSelector(state => state.systemState);
    const {cart} = useTypedSelector(state => state.cartState);
    const {isAuth} = useTypedSelector(state => state.userState);
    const [orderPriceReportHeight, setOrderPriceReportHeight] = useState(0);

    useEffect(() => {
        if (window.innerWidth > 800) {
            return;
        }
        setOrderPriceReportHeight(document.getElementById("cart-order-price-report")?.clientHeight || 0);
    }, []);

    return (
        <div
            className={classes.cart}
            style={{
                paddingBottom: orderPriceReportHeight ? `${orderPriceReportHeight + 10}px` : ""
            }}
        >
            <h1>{translate("cart", currentLang, langs)}</h1>
            <div className={classes.cart__content}>
                <React.Fragment>
                    <section className={classes.cart__group}>
                        <ul className={classes.cart__list}>
                            {
                                cart.length === 0 && (
                                    <section className={classes.cart__empty}>
                                        <h2>{translate("cart_is_empty", currentLang, langs)}</h2>
                                        <Link to={RouteNames.CATALOG}>
                                            <button className={classes.cart__empty__btn}>
                                                {translate("go_to_catalog", currentLang, langs)}
                                                <ShoppingCartOutlined style={{fontSize: "21px"}}/>
                                            </button>
                                        </Link>
                                    </section>
                                )
                            }

                            {cart.map((cartItem) => (
                                <CartItemComponent cartProduct={cartItem} key={cartItem.id}/>
                            ))}
                        </ul>
                    </section>
                    <section id={"cart-order-price-report"} className={classes.cart__group}>
                        <table className={classes.cart__total}>
                            <tbody>
                            <tr>
                                <td className={classes.cart__price__label}>
                                    {translate("products", currentLang, langs)}
                                </td>
                                <td className={classes.cart__price}>{priceFormat(cartPrice(cart), currency)}</td>
                            </tr>
                            </tbody>
                            <tfoot>
                            <tr>
                                <td className={classes.cart__total__price__label}>
                                    {translate("total", currentLang, langs)}
                                </td>
                                <td className={classes.cart__total__price}>{priceFormat(cartTotalPrice(cart), currency)}</td>
                            </tr>
                            </tfoot>
                        </table>
                        <Link to={isAuth ? RouteNames.CHECKOUT : RouteNames.PROFILE}>
                            <button
                                className={
                                    cart.length === 0
                                        ? classes.confirm__btn__disabled
                                        : classes.confirm__btn
                            }
                                disabled={cart.length === 0}
                            >
                                {translate("make_order", currentLang, langs)}
                            </button>
                        </Link>
                    </section>
                </React.Fragment>
            </div>
        </div>
    );
}

interface CartItemComponentProps {
    cartProduct: CartItem;
}

const CartItemComponent = ({cartProduct}: CartItemComponentProps) => {
    const {cfg, currentLang, langs, currency} = useTypedSelector(state => state.systemState);
    const {catalog} = useTypedSelector(state => state.catalogState);
    const {incrementToCart, decrementFromCart, removeFromCart} = useActions();
    const [imgError, setImgError] = useState(false);

    const handleIncrementToCart = () => {
        incrementToCart({id: cartProduct.id, name: cartProduct.name, price: cartProduct.price});
    }

    const handleDecrementFromCart = () => {
        decrementFromCart(cartProduct.id);
    }

    const handleRemoveFromCart = () => {
        removeFromCart(cartProduct.id);
    }

    return (
        <li key={cartProduct.id} className={classes.cart__item}>
            <img
                className={classes.cart__item__image}
                src={catalog.products[cartProduct.id].img}
                title={translate(cartProduct.name, currentLang, langs)}
                alt={translate(cartProduct.name, currentLang, langs)}
                onError={(e) => {
                    if (!imgError) {
                        e.currentTarget.src = `${cfg.assetsUri}/food_placeholder.png`;
                        setImgError(true);
                    }
                }}
            />
            <div className={classes.cart__item__info}>
                <div className={classes.cart__item__info__group__upper}>
                    <h2>{translate(cartProduct.name, currentLang, langs)}</h2>
                    <CrossSVG
                        role={"img"}
                        aria-labelledby={"remove-icon"}
                        className={classes.cart__item__info__group__upper__cross}
                        onClick={handleRemoveFromCart}
                    />
                </div>
                <div className={classes.cart__item__info__group__lower}>
                    <p className={classes.cart__item__info__group__lower__price}>
                        {priceFormat(cartProduct.price * cartProduct.quantity, currency)}
                    </p>
                    <button
                        className={classes.cart__item__info__group__lower__add}
                        onClick={() => {
                            if (!cartProduct) {
                                handleIncrementToCart();
                            }
                        }}
                    >
                        {!!cartProduct && (
                            <MinusSVG
                                role={"img"}
                                aria-labelledby={"decrease-icon"}
                                className={classes.cart__item__info__group__lower__add__icon}
                                onClick={handleDecrementFromCart}
                            />
                        )}
                        <span
                            className={classes.cart__item__info__group__lower__add__quantity}
                            style={{width: cartProduct?.quantity ? "fit-content" : ""}}
                        >
                            {cartProduct?.quantity}
                        </span>
                        {!!cartProduct && (
                            <PlusSVG
                                role={"img"}
                                aria-labelledby={"increase-icon"}
                                className={classes.cart__item__info__group__lower__add__icon}
                                onClick={handleIncrementToCart}
                            />
                        )}
                    </button>
                </div>
            </div>
        </li>
    )
}
