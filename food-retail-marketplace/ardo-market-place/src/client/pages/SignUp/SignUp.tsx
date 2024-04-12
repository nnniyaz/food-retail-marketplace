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
        firstName: "Niyaz",
        lastName: "Nassyrov",
        phone: {
            number: "12345678",
            countryCode: cfg.defaultCountryCode
        },
        email: "nassyrovich@gmail.com",
        password: "Niyazbey2001!",
        address: "Al-farabi 93/19",
        floor: "1",
        apartment: "1",
        deliveryInstruction: "Do not call!"
    });

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
        register({...userCredentials});
    }

    return (
        <div className={classes.registration}>
            <form onSubmit={handleRegister} name={"login"} id={"login"}>
                <h1>{translate("sign_up", currentLang, langs)}</h1>
                <div className={classes.form__row}>
                    <RowInput
                        value={userCredentials.firstName}
                        onChange={handleFirstNameChange}
                        placeholder={translate("first_name", currentLang, langs)}
                        type={"text"}
                        autoComplete={"given-name"}
                        required={true}
                    />
                    <RowInput
                        value={userCredentials.lastName}
                        onChange={handleLastNameChange}
                        placeholder={translate("last_name", currentLang, langs)}
                        type={"text"}
                        autoComplete={"family-name"}
                        required={true}
                    />
                </div>
                <div>
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
                </div>
                <div className={classes.form__row}>
                    <RowInput
                        value={userCredentials.email}
                        onChange={handleEmailChange}
                        placeholder={translate("email", currentLang, langs)}
                        type={"email"}
                        autoComplete={"email"}
                        required={true}
                    />
                    <RowInput
                        value={userCredentials.password}
                        onChange={handlePasswordChange}
                        placeholder={translate("password", currentLang, langs)}
                        type={"password"}
                        autoComplete={"new-password"}
                        required={true}
                    />
                </div>
                <div>
                    <RowInput
                        value={userCredentials.address}
                        onChange={handleAddressChange}
                        placeholder={translate("address", currentLang, langs) + ". " + translate("ex_establishment_name", currentLang, langs)}
                        type={"text"}
                        autoComplete={"street-address"}
                        required={true}
                    />
                </div>
                <div className={classes.form__row}>
                    <RowInput
                        value={userCredentials.floor}
                        onChange={handleFloorChange}
                        placeholder={translate("floor", currentLang, langs)}
                        type={"text"}
                        autoComplete={"address-level1"}
                        required={true}
                    />
                    <RowInput
                        value={userCredentials.apartment}
                        onChange={handleApartmentChange}
                        placeholder={translate("apartment", currentLang, langs)}
                        type={"text"}
                        autoComplete={"address-level2"}
                        required={true}
                    />
                </div>
                <div>
                    <RowInput
                        value={userCredentials.deliveryInstruction}
                        onChange={handleDeliveryInstructionChange}
                        placeholder={translate("delivery_instruction_for_courier", currentLang, langs)}
                        type={"text"}
                        autoComplete={"address-level3"}
                        required={false}
                    />
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

interface RowInputProps {
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    autoComplete?: string;
    required?: boolean;
}

const RowInput = ({placeholder, value, onChange, type, autoComplete, required}: RowInputProps) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
    return (
        <label>
            <input
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                type={type === "password" ? (isPasswordVisible ? "text" : "password") : (type ?? "text")}
                autoComplete={autoComplete}
                required={required ?? false}
            />
            {
                type === "password" && (
                    isPasswordVisible
                        ? <EyeInvisibleOutlined onClick={() => setIsPasswordVisible(false)}/>
                        : <EyeOutlined onClick={() => setIsPasswordVisible(true)}/>
                )
            }
        </label>
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
        placeholder,
        value,
        onChange,
        required,
        valid,
        selectedCountryCode,
        setSelectCountryCode
    }: PhoneInputProps
) => {
    return (
        <label className={classes.phone__input__row}>
            <div className={classes.phone__input__container}>
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
                    maxLength={8}
                    type={"tel"}
                    inputMode={"tel"}
                    autoComplete={"tel-national"}
                    style={{
                        borderColor: valid || valid === undefined ? "" : "red",
                    }}
                />
            </div>
        </label>
    )
}
