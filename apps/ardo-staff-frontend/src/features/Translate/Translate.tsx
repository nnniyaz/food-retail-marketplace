import React from "react";
import {ValidateMlString, MlString} from "@entities/base/MlString";
import {txt} from "@shared/core/i18ngen";
import {useTypedSelector} from "@shared/lib/hooks/useTypedSelector";

export const Translate= (word: string | MlString): string => {
    const {currentLang} = useTypedSelector(state => state.lang);

    if (typeof word === "string") {
        if (!(word in txt)) {
            return `${word} - ${txt.does_not_exist_in_dictionary[currentLang]}`;
        }

        if (!(txt as { [key: string]: MlString })[word]?.[currentLang]) {
            return `${word} - ${txt.not_translated[currentLang]}`;
        }

        return (txt as { [key: string]: MlString })[word][currentLang];
    } else {
        let err = ValidateMlString(word);
        if (err !== null) {
            return txt.not_valid_mlstring[currentLang];
        }

        if (!(word[currentLang])) {
            return txt.not_translated[currentLang];
        }

        return word[currentLang];
    }
};
