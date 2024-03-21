import React from "react";
import * as AntdIcons from "@ant-design/icons";
import {RouteNames} from "@pages/index.tsx";
import {ReturnButton} from "@widgets/ReturnButton";
import {translate} from "@pkg/translate/translate.ts";
import {useActions} from "@pkg/hooks/useActions.ts";
import {priceFormat} from "@pkg/formats/price/priceFormat.ts";
import {useTypedSelector} from "@pkg/hooks/useTypedSelector.ts";
import {cartPrice, cartTotalPrice} from "@pkg/cartPrice/cartPrice.tsx";
import classes from "./Checkout.module.scss";
import {useNavigate} from "react-router-dom";

const {LoadingOutlined} = AntdIcons;

export const Checkout = () => {
    const navigate = useNavigate();
    const {
        cart,
        customerContacts,
        deliveryInfo,
        orderComment,
        isLoadingMakeOrder
    } = useTypedSelector(state => state.cartState);
    const {setCustomerContacts, setDeliveryInfo, setOrderComment, makeOrder} = useActions();

    const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCustomerContacts({...customerContacts, name: e.target.value});
    }

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCustomerContacts({...customerContacts, email: e.target.value});
    }

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCustomerContacts({...customerContacts, phone: e.target.value});
    }

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDeliveryInfo({...deliveryInfo, address: e.target.value});
    }

    const handleOrderCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOrderComment(e.target.value);
    }

    const handleMakeOrder = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        makeOrder({navigate: navigate, path: RouteNames.PROFILE});
    }

    return (
        <div className={classes.checkout}>
            <ReturnButton
                to={RouteNames.CART}
                title={translate("checkout")[0].toUpperCase() + translate("checkout").slice(1)}
            />

            <form className={classes.checkout__content} onSubmit={handleMakeOrder}>
                <section className={classes.checkout__group}>
                    <CheckoutInput
                        label={translate("full_name")}
                        placeholder={translate("enter_full_name")}
                        value={customerContacts.name}
                        onChange={handleFullNameChange}
                        required={true}
                        type={"text"}
                    />
                    <div className={classes.checkout__row}>
                        <CheckoutInput
                            label={translate("email")}
                            placeholder={translate("enter_email")}
                            value={customerContacts.email}
                            onChange={handleEmailChange}
                            required={true}
                            type={"email"}
                        />
                        <CheckoutInput
                            label={translate("phone")}
                            placeholder={translate("enter_phone")}
                            value={customerContacts.phone}
                            onChange={handlePhoneChange}
                            required={true}
                            type={"tel"}
                        />
                    </div>
                    <CheckoutInput
                        label={translate("order_comment")}
                        placeholder={translate("enter_order_comment")}
                        value={orderComment}
                        onChange={handleOrderCommentChange}
                    />
                    <CheckoutInput
                        label={translate("address")}
                        placeholder={translate("enter_address")}
                        value={deliveryInfo.address}
                        onChange={handleAddressChange}
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
                        {isLoadingMakeOrder && <LoadingOutlined className={classes.btn__loading}/>}
                        {translate("buy")[0].toUpperCase() + translate("buy").slice(1)}
                    </button>
                </section>
            </form>
        </div>
    )
}

interface CheckoutInputProps {
    label: string;
    placeholder: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    type?: string;
}

const CheckoutInput = (
    {label, placeholder, value, onChange, required, type}: CheckoutInputProps
) => {
    return (
        <label className={classes.checkout__input__row}>
            {label}
            <input
                value={value}
                onChange={onChange}
                required={required || false}
                placeholder={placeholder[0].toUpperCase() + placeholder.slice(1)}
                type={type || "text"}
            />
        </label>
    )
}
