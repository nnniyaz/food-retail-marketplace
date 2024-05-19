import React, {Dispatch, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {Select} from "antd";
import * as AntdIcons from "@ant-design/icons";
import {RouteNames} from "@pages/index.tsx";
import {translate} from "@pkg/translate/translate.ts";
import {useActions} from "@pkg/hooks/useActions.ts";
import {phoneFormat} from "@pkg/formats/phone/phoneFormat.ts";
import {useTypedSelector} from "@pkg/hooks/useTypedSelector.ts";
import {CountryCode, countryCodesInfo} from "@pkg/formats/phone/countryCodes.ts";
import classes from "./SignUp.module.scss";

const {LoadingOutlined, EyeOutlined, EyeInvisibleOutlined} = AntdIcons;

export const SignUp = () => {
    const navigate = useNavigate();
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
        deliveryInstruction: "Do not call!",
        preferredLang: currentLang
    });

    const [validation, setValidation] = useState({
        firstName: true,
        lastName: true,
        phone: true,
        email: true,
        password: true,
        address: true,
        floor: true,
        apartment: true,
        deliveryInstruction: true
    });

    const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserCredentials({...userCredentials, firstName: e.target.value});
        setValidation({...validation, firstName: e.target.value.length > 1 && e.target.value.length < 101});
    }

    const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserCredentials({...userCredentials, lastName: e.target.value});
        setValidation({...validation, lastName: e.target.value.length > 1 && e.target.value.length < 101});
    }

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const phone = e.target.value || "";
        switch (userCredentials.phone.countryCode) {
            case CountryCode.HK:
                if (phone.replace(/[ \-()+]/g, "").length > 8) {
                    return;
                }
                setUserCredentials({...userCredentials, phone: {...userCredentials.phone, number: phone}});
                setValidation({...validation, phone: phone.length === 8});
                break;
            case CountryCode.KZ:
                if (phone.replace(/[ \-()+]/g, "").length > 10) {
                    return;
                }
                setUserCredentials({...userCredentials, phone: {...userCredentials.phone, number: phone}});
                setValidation({...validation, phone: phone.length === 10 && phone.startsWith("7")});
                break;
        }
    }

    const handlePhoneCountryCodeChange = (code: CountryCode) => {
        setUserCredentials({...userCredentials, phone: {...userCredentials.phone, countryCode: code}});
    }

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserCredentials({...userCredentials, email: e.target.value});
        setValidation({...validation, email: e.target.value.includes("@")});
    }

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserCredentials({...userCredentials, address: e.target.value});
        setValidation({...validation, address: e.target.value.length > 1});
    }

    const handleFloorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserCredentials({...userCredentials, floor: e.target.value});
        setValidation({...validation, floor: e.target.value.length > 0});
    }

    const handleApartmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserCredentials({...userCredentials, apartment: e.target.value});
        setValidation({...validation, apartment: e.target.value.length > 0});
    }

    const handleDeliveryInstructionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserCredentials({...userCredentials, deliveryInstruction: e.target.value});
        setValidation({...validation, deliveryInstruction: e.target.value.length > 0});
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserCredentials({...userCredentials, password: e.target.value});
        setValidation({...validation, password: e.target.value.length > 5 && e.target.value.length < 32});
    }

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await register({...userCredentials});
        navigate(RouteNames.PROFILE);
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
                        valid={validation.firstName}
                    />
                    <RowInput
                        value={userCredentials.lastName}
                        onChange={handleLastNameChange}
                        placeholder={translate("last_name", currentLang, langs)}
                        type={"text"}
                        autoComplete={"family-name"}
                        required={true}
                        valid={validation.lastName}
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
                        valid={validation.phone}
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
                        valid={validation.email}
                    />
                    <RowInput
                        value={userCredentials.password}
                        onChange={handlePasswordChange}
                        placeholder={translate("password", currentLang, langs)}
                        type={"password"}
                        autoComplete={"new-password"}
                        required={true}
                        valid={validation.password}
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
                        valid={validation.address}
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
                        valid={validation.floor}
                    />
                    <RowInput
                        value={userCredentials.apartment}
                        onChange={handleApartmentChange}
                        placeholder={translate("apartment", currentLang, langs)}
                        type={"text"}
                        autoComplete={"address-level2"}
                        required={true}
                        valid={validation.apartment}
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
                <button type={"submit"} disabled={isLoadingRegister} style={{opacity: isLoadingRegister ? 0.5 : 1}}>
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
    valid?: boolean;
}

const RowInput = ({placeholder, value, onChange, type, valid, autoComplete, required}: RowInputProps) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
    return (
        <label style={{borderColor: valid || valid === undefined ? "" : "red"}}>
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
