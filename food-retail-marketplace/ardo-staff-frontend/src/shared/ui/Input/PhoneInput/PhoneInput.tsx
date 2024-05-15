import React, {FC, useMemo, useState} from "react";
import {Input, Select, Space} from "antd";
import {CountryCodeEnum, CountryCodes, Phone} from "@entities/base/phone";
import {txt} from "@shared/core/i18ngen";
import {countryCodesOptions} from "@shared/lib/options/countryCodes";
import {useTypedSelector} from "@shared/lib/hooks/useTypedSelector";
import {phoneFormat} from "@shared/lib/phone/phoneFormat";

interface PhoneInputProps {
    value: Phone;
    onChange: (value: Phone) => void;
}

export const PhoneInput: FC<PhoneInputProps> = (props) => {
    const {currentLang} = useTypedSelector((state) => state.lang);
    const [selectedCountryCode, setSelectedCountryCode] = useState<CountryCodeEnum>(props.value.countryCode);
    const placeholder = useMemo(() => {
        switch (selectedCountryCode) {
            case CountryCodeEnum.HK:
                return "1234 5678";
            case CountryCodeEnum.KZ:
                return "777 123 45 67";
            default:
                return txt.select_country_code[currentLang];
        }
    }, [selectedCountryCode, currentLang]);

    const numberLength = useMemo(() => {
        switch (selectedCountryCode) {
            case CountryCodeEnum.HK:
                return 8;
            case CountryCodeEnum.KZ:
                return 10;
            default:
                return 0;
        }
    }, [selectedCountryCode]);

    return (
        <Space.Compact style={{width: "100%"}}>
            <Select
                options={countryCodesOptions}
                value={selectedCountryCode}
                onChange={(value) => {
                    setSelectedCountryCode(value);
                    props.onChange({
                        countryCode: value,
                        number: props.value.number
                    });
                }}
                style={{width: "75px"}}
            />
            <Input
                type={"tel"}
                maxLength={numberLength}
                placeholder={placeholder}
                prefix={CountryCodes[selectedCountryCode].dialCode}
                value={phoneFormat(props.value.number, selectedCountryCode)}
                onChange={(e) => {
                    const number = e.target.value.replaceAll(" ", "");
                    if (isNaN(Number(number))) return;
                    props.onChange({
                        countryCode: selectedCountryCode,
                        number: number
                    });
                }}
                style={{width: "calc(100% - 75px)"}}
            />
        </Space.Compact>
    );
};
