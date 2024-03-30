import React, {Dispatch, useState} from "react";
import {Link} from "react-router-dom";
import * as AntdIcons from "@ant-design/icons";
import {RouteNames} from "@pages/index.tsx";
import {translate} from "@pkg/translate/translate.ts";
import {useActions} from "@pkg/hooks/useActions.ts";
import {useTypedSelector} from "@pkg/hooks/useTypedSelector.ts";
import classes from "./SignUp.module.scss";
import {Select} from "antd";
import {CountryCode, countryCodesInfo} from "@pkg/formats/phone/countryCodes.ts";
import {phoneFormat} from "@pkg/formats/phone/phoneFormat.ts";

const {LoadingOutlined, EyeOutlined, EyeInvisibleOutlined} = AntdIcons;

export const SignUp = () => {
    const {cfg, currentLang, langs} = useTypedSelector(state => state.systemState);
    const {isLoadingRegister} = useTypedSelector(state => state.userState);
    const {register} = useActions();
    const [userCredentials, setUserCredentials] = useState({
        firstName: "",
        lastName: "",
        phone: {
            number: "",
            countryCode: cfg.defaultCountryCode
        },
        email: "",
        password: "",
        address: "",
        floor: "",
        apartment: "",
        deliveryInstruction: ""
    });
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

    const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserCredentials({...userCredentials, firstName: e.target.value});
    }

    const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserCredentials({...userCredentials, lastName: e.target.value});
    }

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserCredentials({...userCredentials, phone: {...userCredentials.phone, number: e.target.value}});
    }

    const handlePhoneCountryCodeChange = (code: CountryCode) => {
        setUserCredentials({...userCredentials, phone: {...userCredentials.phone, countryCode: code}});
    }

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserCredentials({...userCredentials, email: e.target.value});
    }

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserCredentials({...userCredentials, address: e.target.value});
    }

    const handleFloorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserCredentials({...userCredentials, floor: e.target.value});
    }

    const handleApartmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserCredentials({...userCredentials, apartment: e.target.value});
    }

    const handleDeliveryInstructionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserCredentials({...userCredentials, deliveryInstruction: e.target.value});
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserCredentials({...userCredentials, password: e.target.value});
    }

    const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        register({
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            preferredLang: currentLang,
        });
    }

    return (
        <div className={classes.registration}>
            <form onSubmit={handleRegister} name={"login"} id={"login"}>
                <h1>{translate("sign_up", currentLang, langs)}</h1>
                <div className={classes.form__row}>
                    <div>
                        <label style={{borderColor: true ? "#ee1616" : ""}}>
                            <input
                                value={userCredentials.firstName}
                                onChange={handleFirstNameChange}
                                placeholder={translate("first_name", currentLang, langs)}
                                type={"text"}
                                autoComplete={"given-name"}
                                required
                            />
                        </label>
                        {/*{!!authError.email && (*/}
                        {/*    <div className={classes.error__message}>*/}
                        {/*        {authError.email[0].toUpperCase() + authError.email.slice(1)}*/}
                        {/*    </div>*/}
                        {/*)}*/}
                    </div>
                    <div>
                        <label style={{borderColor: true ? "#ee1616" : ""}}>
                            <input
                                value={userCredentials.lastName}
                                onChange={handleLastNameChange}
                                placeholder={translate("last_name", currentLang, langs)}
                                type={"text"}
                                autoComplete={"family-name"}
                                required
                            />
                        </label>
                        {/*{!!authError.email && (*/}
                        {/*    <div className={classes.error__message}>*/}
                        {/*        {authError.email[0].toUpperCase() + authError.email.slice(1)}*/}
                        {/*    </div>*/}
                        {/*)}*/}
                    </div>
                </div>
                <div>
                    {/*<input*/}
                    {/*    value={userCredentials.phone.number}*/}
                    {/*    onChange={handlePhoneChange}*/}
                    {/*    placeholder={translate("phone", currentLang, langs)}*/}
                    {/*    type={"tel"}*/}
                    {/*    autoComplete={"tel-national"}*/}
                    {/*    required*/}
                    {/*/>*/}
                    <PhoneInput
                        label={translate("phone", currentLang, langs)}
                        placeholder={translate("enter_phone", currentLang, langs)}
                        selectedCountryCode={userCredentials.phone.countryCode}
                        setSelectCountryCode={handlePhoneCountryCodeChange}
                        value={phoneFormat(userCredentials.phone.number, userCredentials.phone.countryCode)}
                        onChange={handlePhoneChange}
                        required={true}
                        valid={true}
                    />
                    {/*{!!authError.email && (*/}
                    {/*    <div className={classes.error__message}>*/}
                    {/*        {authError.email[0].toUpperCase() + authError.email.slice(1)}*/}
                    {/*    </div>*/}
                    {/*)}*/}
                </div>
                <div>
                    <label style={{borderColor: true ? "#ee1616" : ""}}>
                        <input
                            value={userCredentials.email}
                            onChange={handleEmailChange}
                            placeholder={translate("email", currentLang, langs)}
                            type={"email"}
                            autoComplete={"email"}
                            required
                        />
                    </label>
                    {/*{!!authError.email && (*/}
                    {/*    <div className={classes.error__message}>*/}
                    {/*        {authError.email[0].toUpperCase() + authError.email.slice(1)}*/}
                    {/*    </div>*/}
                    {/*)}*/}
                </div>
                <div>
                    <label style={{borderColor: true ? "#ee1616" : ""}}>
                        <input
                            value={userCredentials.password}
                            onChange={handlePasswordChange}
                            placeholder={translate("password", currentLang, langs)}
                            type={isPasswordVisible ? "text" : "password"}
                            autoComplete={"new-password"}
                            required
                        />
                        {
                            isPasswordVisible
                                ? <EyeInvisibleOutlined onClick={() => setIsPasswordVisible(false)}/>
                                : <EyeOutlined onClick={() => setIsPasswordVisible(true)}/>
                        }
                    </label>
                    {/*{!!authError.password && (*/}
                    {/*    <div className={classes.error__message}>*/}
                    {/*        {authError.password[0].toUpperCase() + authError.password.slice(1)}*/}
                    {/*    </div>*/}
                    {/*)}*/}
                </div>
                <div>
                    <label style={{borderColor: true ? "#ee1616" : ""}}>
                        <input
                            value={userCredentials.address}
                            onChange={handleAddressChange}
                            placeholder={translate("address", currentLang, langs) + ". " + translate("ex_establishment_name", currentLang, langs)}
                            type={"text"}
                            autoComplete={"street-address"}
                            required
                        />
                    </label>
                    {/*{!!authError.password && (*/}
                    {/*    <div className={classes.error__message}>*/}
                    {/*        {authError.password[0].toUpperCase() + authError.password.slice(1)}*/}
                    {/*    </div>*/}
                    {/*)}*/}
                </div>
                <div className={classes.form__row}>
                    <div>
                        <label style={{borderColor: true ? "#ee1616" : ""}}>
                            <input
                                value={userCredentials.floor}
                                onChange={handleFloorChange}
                                placeholder={translate("floor", currentLang, langs)}
                                type={"text"}
                                autoComplete={"address-level1"}
                                required
                            />
                        </label>
                        {/*{!!authError.password && (*/}
                        {/*    <div className={classes.error__message}>*/}
                        {/*        {authError.password[0].toUpperCase() + authError.password.slice(1)}*/}
                        {/*    </div>*/}
                        {/*)}*/}
                    </div>
                    <div>
                        <label style={{borderColor: true ? "#ee1616" : ""}}>
                            <input
                                value={userCredentials.apartment}
                                onChange={handleApartmentChange}
                                placeholder={translate("apartment", currentLang, langs)}
                                type={"text"}
                                autoComplete={"address-level2"}
                                required
                            />
                        </label>
                        {/*{!!authError.password && (*/}
                        {/*    <div className={classes.error__message}>*/}
                        {/*        {authError.password[0].toUpperCase() + authError.password.slice(1)}*/}
                        {/*    </div>*/}
                        {/*)}*/}
                    </div>
                </div>
                <div>
                    <label style={{borderColor: true ? "#ee1616" : ""}}>
                        <input
                            value={userCredentials.deliveryInstruction}
                            onChange={handleDeliveryInstructionChange}
                            placeholder={translate("delivery_instruction_for_courier", currentLang, langs)}
                            type={"text"}
                            autoComplete={"address-level3"}
                        />
                    </label>
                    {/*{!!authError.password && (*/}
                    {/*    <div className={classes.error__message}>*/}
                    {/*        {authError.password[0].toUpperCase() + authError.password.slice(1)}*/}
                    {/*    </div>*/}
                    {/*)}*/}
                </div>
                <button type={"submit"} disabled={isLoadingRegister}>
                    <span>{translate("register", currentLang, langs)}</span>
                    {isLoadingRegister && <LoadingOutlined className={classes.btn__loading}/>}
                </button>
                <div className={classes.divider}>
                    <hr/>
                    <span>{translate("or", currentLang, langs)}</span>
                    <hr/>
                </div>
                <Link to={RouteNames.PROFILE} style={{textDecoration: "none"}}>
                    <button disabled={isLoadingRegister}>
                        <span>{translate("sign_in", currentLang, langs)}</span>
                        {isLoadingRegister && <LoadingOutlined className={classes.btn__loading}/>}
                    </button>
                </Link>
            </form>
        </div>
    )
}

interface PhoneInputProps {
    label: string;
    placeholder: string;
    selectedCountryCode: CountryCode;
    setSelectCountryCode: Dispatch<CountryCode>;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    valid?: boolean;
}

const PhoneInput = (
    {
        label,
        placeholder,
        value,
        onChange,
        required,
        valid,
        selectedCountryCode,
        setSelectCountryCode
    }: PhoneInputProps
) => {
    const [isFocused, setIsFocused] = useState(false);
    return (
        <label className={classes.phone__input__row}>
            {/*<span>{required && <span style={{color: "red", marginRight: "5px"}}>*</span>}{label}</span>*/}
            <div
                className={isFocused
                    ? `${classes.phone__input__container} ${classes.phone__input__container__focused}`
                    : classes.phone__input__container
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
                    className={classes.phone__input__select}
                    suffixIcon={null}
                />
                <span className={classes.phone__input__container__divider}></span>
                <input
                    value={value}
                    onChange={onChange}
                    required={required || false}
                    placeholder={placeholder}
                    type={"tel"}
                    inputMode={"tel"}
                    autoComplete={"tel-national"}
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
