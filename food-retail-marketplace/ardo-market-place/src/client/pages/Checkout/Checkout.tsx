import React from "react";
import {RouteNames} from "@pages/index.tsx";
import {translate} from "@pkg/translate/translate.ts";
import {useTypedSelector} from "@pkg/hooks/useTypedSelector.ts";
import {ReturnButton} from "@widgets/ReturnButton";
import classes from "./Checkout.module.scss";
import {priceFormat} from "@pkg/formats/price/priceFormat.ts";
import {cartPrice, cartTotalPrice} from "@pkg/cartPrice/cartPrice.tsx";

export const Checkout = () => {
    const {cart} = useTypedSelector(state => state.cartState);

    return (
        <React.Fragment>
            <ReturnButton
                to={RouteNames.CART}
                title={translate("checkout")[0].toUpperCase() + translate("checkout").slice(1)}
            />

            <div className={classes.checkout}>
                <section className={classes.checkout__group}>
                    <CheckoutInput
                        label={translate("first_name")}
                        placeholder={translate("enter_first_name")}
                    />
                    <CheckoutInput
                        label={translate("last_name")}
                        placeholder={translate("enter_last_name")}
                    />
                    <CheckoutInput
                        label={translate("email")}
                        placeholder={translate("enter_email")}
                    />
                    <CheckoutInput
                        label={translate("phone")}
                        placeholder={translate("enter_phone")}
                    />
                </section>
                <section className={classes.checkout__group}>
                    <table className={classes.checkout__total}>
                        <tbody>
                        <tr>
                            <td className={classes.checkout__price__label}>
                                {translate("products")[0].toUpperCase() + translate("products").slice(1)}
                            </td>
                            <td className={classes.checkout__price}>{priceFormat(cartPrice(cart))}</td>
                        </tr>
                        </tbody>
                        <tfoot>
                        <tr>
                            <td className={classes.checkout__total__price__label}>
                                {translate("total").toUpperCase()}
                            </td>
                            <td className={classes.checkout__total__price}>{priceFormat(cartTotalPrice(cart))}</td>
                        </tr>
                        </tfoot>
                    </table>
                    <button className={classes.confirm__btn}>
                        {translate("buy")[0].toUpperCase() + translate("buy").slice(1)}
                    </button>
                </section>
            </div>
        </React.Fragment>
    )
}

interface CheckoutInputProps {
    label: string;
    placeholder: string;
}

const CheckoutInput = ({label, placeholder}: CheckoutInputProps) => {
    return (
        <label className={classes.checkout__input__row}>
            {label}
            <input
                type="text"
                placeholder={placeholder[0].toUpperCase() + placeholder.slice(1)}
            />
        </label>
    )
}
