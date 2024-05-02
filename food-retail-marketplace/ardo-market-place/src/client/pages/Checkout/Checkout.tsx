import React, {Dispatch, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Select} from "antd";
import * as AntdIcons from "@ant-design/icons";
import {RouteNames} from "@pages/index.tsx";
import {ReturnButton} from "@widgets/ReturnButton";
import {translate} from "@pkg/translate/translate";
import {useActions} from "@pkg/hooks/useActions.ts";
import {priceFormat} from "@pkg/formats/price/priceFormat.ts";
import {CountryCode, countryCodesInfo} from "@pkg/formats/phone/countryCodes.ts";
import {phoneFormat} from "@pkg/formats/phone/phoneFormat.ts";
import {validatePhone} from "@pkg/formats/phone/validatePhone.ts";
import {useTypedSelector} from "@pkg/hooks/useTypedSelector.ts";
import {cartPrice, cartTotalPrice} from "@pkg/cartPrice/cartPrice.tsx";
import classes from "./Checkout.module.scss";

const {LoadingOutlined} = AntdIcons;

export const Checkout = () => {
    const navigate = useNavigate();
    const {currentLang, langs, currency} = useTypedSelector(state => state.systemState);
    const {
        cart,
        deliveryInfo,
        isLoadingMakeOrder,
        customerContacts
    } = useTypedSelector(state => state.cartState);
    const {user} = useTypedSelector(state => state.userState);
    const {setDeliveryInfo, makeOrder, setCustomerContacts} = useActions();
    const [isValid, setIsValid] = useState({
        address: true,
        floor: true,
        phone: true
    });

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDeliveryInfo({...deliveryInfo, address: e.target.value});
        setIsValid({...isValid, address: e.target.value.length > 0});
    }

    const handleFloorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDeliveryInfo({...deliveryInfo, floor: e.target.value});
        setIsValid({...isValid, floor: e.target.value.length > 0});
    }

    const handleApartmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDeliveryInfo({...deliveryInfo, apartment: e.target.value});
    }

    const handleDeliveryCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDeliveryInfo({...deliveryInfo, deliveryComment: e.target.value});
    }

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const phone = e.target.value.replace(/\D/g, "");
        if (isNaN(Number(phone))) return;
        switch (customerContacts.phone.countryCode) {
            case CountryCode.HK:
                if (phone.length > 8) return;
                break;
            case CountryCode.KZ:
                if (phone.length > 10) return;
                break;
        }
        setCustomerContacts({
            ...customerContacts,
            phone: {
                number: phone,
                countryCode: customerContacts.phone.countryCode
            }
        });
        setIsValid({
            ...isValid,
            phone: phone.length > 0 && validatePhone(phone, customerContacts.phone.countryCode)
        });
    }

    const handlePhoneCountryCodeChange = (countryCode: CountryCode) => {
        setCustomerContacts({
            ...customerContacts,
            phone: {
                number: customerContacts.phone.number,
                countryCode: countryCode
            }
        });
        setIsValid({
            ...isValid,
            phone: validatePhone(customerContacts.phone.number, countryCode)
        });
    }

    const handleMakeOrder = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        makeOrder({navigate: navigate, path: RouteNames.SUCCESS});
    }

    return (
        <div className={classes.checkout}>
            <ReturnButton
                to={RouteNames.CART}
                title={translate("checkout", currentLang, langs)}
            />

            <form className={classes.checkout__content} onSubmit={handleMakeOrder}>
                <section className={classes.checkout__group}>
                    <div className={classes.checkout__info__group}>
                        <div className={classes.checkout__info__row}>
                            <p className={classes.checkout__info__row__label}>
                                {translate("receiver", currentLang, langs)}
                            </p>
                            <p className={classes.checkout__info__row__value}>
                                {`${user.firstName} ${user.lastName}`}
                            </p>
                        </div>
                        <div className={classes.checkout__info__row}>
                            <p className={classes.checkout__info__row__label}>
                                {translate("email", currentLang, langs)}
                            </p>
                            <p className={classes.checkout__info__row__value}>
                                {user.email || "-"}
                            </p>
                        </div>
                        {(!!user.phone?.countryCode && !!user.phone?.number) && (
                            <div className={classes.checkout__info__row}>
                                <p className={classes.checkout__info__row__label}>
                                    {translate("phone", currentLang, langs)}
                                </p>
                                <p className={classes.checkout__info__row__value}>
                                    {phoneFormat(user.phone.number, user.phone.countryCode) || "-"}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className={classes.checkout__info__group}>
                        <div className={classes.checkout__info__row}>
                            <p className={classes.checkout__info__row__label}>
                                {translate("address", currentLang, langs)}
                            </p>
                            <p className={classes.checkout__info__row__value}>
                                {user.lastDeliveryPoint.address || "-"}
                            </p>
                        </div>
                        <div className={classes.checkout__info__row}>
                            <p className={classes.checkout__info__row__label}>
                                {translate("floor", currentLang, langs)}
                            </p>
                            <p className={classes.checkout__info__row__value}>
                                {user.lastDeliveryPoint.floor || "-"}
                            </p>
                        </div>
                        <div className={classes.checkout__info__row}>
                            <p className={classes.checkout__info__row__label}>
                                {translate("apartment", currentLang, langs)}
                            </p>
                            <p className={classes.checkout__info__row__value}>
                                {user.lastDeliveryPoint.apartment || "-"}
                            </p>
                        </div>
                        {(!!user.lastDeliveryPoint.deliveryComment) && (
                            <div className={classes.checkout__info__row}>
                                <p className={classes.checkout__info__row__label}>
                                    {translate("delivery_instruction", currentLang, langs)}
                                </p>
                                <p className={classes.checkout__info__row__value}>
                                    {user.lastDeliveryPoint.deliveryComment || "-"}
                                </p>
                            </div>
                        )}
                    </div>

                    {(!user.phone?.countryCode && !user.phone?.number) && (
                        <CheckoutPhoneInput
                            label={translate("phone", currentLang, langs)}
                            placeholder={translate("enter_phone", currentLang, langs)}
                            selectedCountryCode={customerContacts.phone.countryCode}
                            setSelectCountryCode={handlePhoneCountryCodeChange}
                            value={phoneFormat(customerContacts.phone.number, customerContacts.phone.countryCode)}
                            onChange={handlePhoneChange}
                            required={true}
                            valid={isValid.phone}
                        />
                    )}

                    {(!user.lastDeliveryPoint.address || !user.lastDeliveryPoint.floor) && (
                        <React.Fragment>
                            <CheckoutInput
                                label={translate("address", currentLang, langs)}
                                placeholder={translate("enter_address", currentLang, langs)}
                                value={deliveryInfo.address}
                                onChange={handleAddressChange}
                                required={true}
                                valid={isValid.address}
                            />
                            <CheckoutInput
                                label={translate("floor", currentLang, langs)}
                                placeholder={translate("enter_floor", currentLang, langs)}
                                value={deliveryInfo.floor}
                                onChange={handleFloorChange}
                                required={true}
                                valid={isValid.floor}
                            />
                            <CheckoutInput
                                label={translate("apartment", currentLang, langs)}
                                placeholder={translate("enter_apartment", currentLang, langs)}
                                value={deliveryInfo.apartment}
                                onChange={handleApartmentChange}
                                required={false}
                            />
                            <CheckoutInput
                                label={translate("delivery_instruction_for_courier", currentLang, langs)}
                                placeholder={translate("enter_delivery_instruction", currentLang, langs)}
                                value={deliveryInfo.deliveryComment}
                                onChange={handleDeliveryCommentChange}
                                required={false}
                            />
                        </React.Fragment>
                    )}
                </section>
                <section className={classes.checkout__group}>
                    <table className={classes.checkout__total}>
                        <tbody>
                        <tr>
                            <td className={classes.checkout__price__label}>
                                {translate("products", currentLang, langs)}
                            </td>
                            <td className={classes.checkout__price}>{priceFormat(cartPrice(cart), currency)}</td>
                        </tr>
                        </tbody>
                        <tfoot>
                        <tr>
                            <td className={classes.checkout__total__price__label}>
                                {translate("total", currentLang, langs).toUpperCase()}
                            </td>
                            <td className={classes.checkout__total__price}>{priceFormat(cartTotalPrice(cart), currency)}</td>
                        </tr>
                        </tfoot>
                    </table>
                    <button className={classes.confirm__btn} disabled={isLoadingMakeOrder} style={{opacity: isLoadingMakeOrder ? 0.5 : 1}}>
                        {translate("buy", currentLang, langs)}
                        {isLoadingMakeOrder && <LoadingOutlined className={classes.btn__loading}/>}
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
    valid?: boolean;
}

const CheckoutInput = (
    {label, placeholder, value, onChange, required, type, valid}: CheckoutInputProps
) => {
    return (
        <label className={classes.checkout__input__row}>
            <span>{required && <span style={{color: "red", marginRight: "5px"}}>*</span>}{label}</span>
            <input
                value={value}
                onChange={onChange}
                required={required || false}
                placeholder={placeholder}
                type={type || "text"}
                style={{borderColor: valid || valid === undefined ? "" : "red"}}
            />
        </label>
    )
}

interface CheckoutPhoneInputProps {
    label: string;
    placeholder: string;
    selectedCountryCode: CountryCode;
    setSelectCountryCode: Dispatch<CountryCode>;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    valid?: boolean;
}

const CheckoutPhoneInput = (
    {
        label,
        placeholder,
        value,
        onChange,
        required,
        valid,
        selectedCountryCode,
        setSelectCountryCode
    }: CheckoutPhoneInputProps
) => {
    const [isFocused, setIsFocused] = useState(false);
    return (
        <label className={classes.checkout__phone__input__row}>
            <span>{required && <span style={{color: "red", marginRight: "5px"}}>*</span>}{label}</span>
            <div
                className={isFocused
                    ? `${classes.checkout__phone__input__container} ${classes.checkout__phone__input__container__focused}`
                    : classes.checkout__phone__input__container
                }
            >
                <Select
                    value={selectedCountryCode}
                    onChange={setSelectCountryCode}
                    style={{minWidth: "82px", maxWidth: "82px", textAlign: "center"}}
                    dropdownStyle={{width: "100px"}}
                    options={[
                        ...Object.keys(countryCodesInfo).map((code) => ({
                            value: code,
                            label: `${countryCodesInfo[code].dial_code} ${countryCodesInfo[code].flag}`
                        }))
                    ]}
                    className={classes.checkout__phone__input__select}
                    suffixIcon={null}
                />
                <span className={classes.checkout__phone__input__container__divider}></span>
                <input
                    value={value}
                    onChange={onChange}
                    required={required || false}
                    placeholder={placeholder}
                    type={"tel"}
                    inputMode={"tel"}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    style={{
                        borderColor: valid || valid === undefined ? "" : "red",
                    }}
                />
            </div>
        </label>
    )
}
