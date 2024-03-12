import PlusSVG from "@assets/icons/plus-circle.svg?react";
import MinusSVG from "@assets/icons/minus-circle.svg?react";
import CrossSVG from "@assets/icons/cross.svg?react";
import {CartItem} from "@domain/cartItem";
import {translate} from "@pkg/translate/translate.ts";
import {useActions} from "@pkg/hooks/useActions.ts";
import {priceFormat} from "@pkg/formats/price/priceFormat.ts";
import {useTypedSelector} from "@pkg/hooks/useTypedSelector.ts";
import classes from "./Cart.module.scss";
import {useState} from "react";

export const Cart = () => {
    const {cart} = useTypedSelector(state => state.cartState);
    return (
        <div className={classes.cart}>
            <h1>{translate("cart")}</h1>
            <ul className={classes.cart__list}>
                {cart.map((cartItem) => <CartItemComponent cartProduct={cartItem}/>)}
            </ul>
            <table className={classes.cart__total}>
                <tbody>
                <tr>
                    <td className={classes.cart__total__price__label}>Итого:</td>
                    <td className={classes.cart__total__price}>{priceFormat(0)}</td>
                </tr>
                </tbody>
            </table>
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
