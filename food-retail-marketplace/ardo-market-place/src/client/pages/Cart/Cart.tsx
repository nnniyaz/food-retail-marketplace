import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {RouteNames} from "@pages/index.tsx";
import PlusSVG from "@assets/icons/plus-circle.svg?react";
import MinusSVG from "@assets/icons/minus-circle.svg?react";
import CrossSVG from "@assets/icons/cross.svg?react";
import {CartItem} from "@domain/cartItem";
import {translate} from "@pkg/translate/translate.ts";
import {useActions} from "@pkg/hooks/useActions.ts";
import {priceFormat} from "@pkg/formats/price/priceFormat.ts";
import {cartPrice, cartTotalPrice} from "@pkg/cartPrice/cartPrice.tsx";
import {useTypedSelector} from "@pkg/hooks/useTypedSelector.ts";
import classes from "./Cart.module.scss";

export const Cart = () => {
    const {cart} = useTypedSelector(state => state.cartState);
    const {isAuth} = useTypedSelector(state => state.userState);
    const [orderPriceReportHeight, setOrderPriceReportHeight] = useState(0);

    useEffect(() => {
        if (window.innerWidth > 800) {
            return;
        }
        console.log(document.getElementById("order-price-report")?.clientHeight)
        setOrderPriceReportHeight(document.getElementById("order-price-report")?.clientHeight || 0);
    }, []);

    return (
        <div
            className={classes.cart}
            style={{
                paddingBottom: orderPriceReportHeight ? `${orderPriceReportHeight + 10}px` : ""
            }}
        >
            <h1>{translate("cart")[0].toUpperCase() + translate("cart").slice(1)}</h1>
            <div className={classes.cart__content}>
                <section className={classes.cart__group}>
                    <ul className={classes.cart__list}>
                        {cart.map((cartItem) => (
                            <CartItemComponent cartProduct={cartItem} key={cartItem.id}/>
                        ))}
                    </ul>
                </section>
                <section id={"order-price-report"} className={classes.cart__group}>
                    <table className={classes.cart__total}>
                        <tbody>
                        <tr>
                            <td className={classes.cart__price__label}>
                                {translate("products")[0].toUpperCase() + translate("products").slice(1)}
                            </td>
                            <td className={classes.cart__price}>{priceFormat(cartPrice(cart))}</td>
                        </tr>
                        </tbody>
                        <tfoot>
                        <tr>
                            <td className={classes.cart__total__price__label}>
                                {translate("total").toUpperCase()}
                            </td>
                            <td className={classes.cart__total__price}>{priceFormat(cartTotalPrice(cart))}</td>
                        </tr>
                        </tfoot>
                    </table>
                    {cart.length > 0 && (
                        <Link to={isAuth ? RouteNames.CHECKOUT : RouteNames.PROFILE}>
                            <button className={classes.confirm__btn}>
                                {translate("make_order")[0].toUpperCase() + translate("make_order").slice(1)}
                            </button>
                        </Link>
                    )}
                </section>
            </div>
        </div>
    );
}

interface CartItemComponentProps {
    cartProduct: CartItem;
}

const CartItemComponent = ({cartProduct}: CartItemComponentProps) => {
    const {cfg} = useTypedSelector(state => state.systemState);
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
                alt={translate(cartProduct.name)}
                onError={(e) => {
                    if (!imgError) {
                        e.currentTarget.src = `${cfg.assetsUri}/food_placeholder.png`;
                        setImgError(true);
                    }
                }}
            />
            <div className={classes.cart__item__info}>
                <div className={classes.cart__item__info__group__upper}>
                    <h2>{translate(cartProduct.name)}</h2>
                    <CrossSVG
                        className={classes.cart__item__info__group__upper__cross}
                        onClick={handleRemoveFromCart}
                    />
                </div>
                <div className={classes.cart__item__info__group__lower}>
                    <p className={classes.cart__item__info__group__lower__price}>
                        {priceFormat(cartProduct.price * cartProduct.quantity)}
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
