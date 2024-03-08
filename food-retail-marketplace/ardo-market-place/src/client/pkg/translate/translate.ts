import {Langs, MlString} from "@domain/base/mlString/mlString.ts";
import {useTypedSelector} from "@pkg/hooks/useTypedSelector.ts";
import {txts} from "../../../server/pkg/core/txts.ts";

export function translate(word: MlString | string): string {
    const {currentLang, langs} = useTypedSelector(state => state.systemState);

    if (typeof word === "string") {
        if (txts?.[word]) {
            if (txts[word]?.[currentLang]) {
                return txts[word][currentLang];
            } else {
                return findFromOtherLangs(txts[word], langs);
            }
        } else {
            return txts["translation_not_found"]?.[currentLang] || "translation_not_found"
        }
    } else {
        if (word?.[currentLang]) {
            return word[currentLang];
        } else {
            return findFromOtherLangs(word, langs);
        }
    }
}

function findFromOtherLangs(word: MlString, otherLangs: Langs[]): string {
    const empty: string = "";
    otherLangs = [...otherLangs] || [];

    if (otherLangs.length === 0) {
        return empty;
    } else {
        const isMultipleLangs = otherLangs.filter(lang => !!word?.[lang]).length > 1;

        if (isMultipleLangs) {
            return empty;
        }

        const lang = otherLangs.find(lang => !!word?.[lang]);

        if (!lang) {
            return empty;
        }

        return word[lang];
    }
}
