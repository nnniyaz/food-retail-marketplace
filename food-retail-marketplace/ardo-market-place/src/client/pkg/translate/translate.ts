import {Langs, MlString} from "@domain/base/mlString/mlString.ts";
import {txts} from "../../../server/pkg/core/txts.ts";

export function translate(word: MlString | string, currentLang, langs): string {
    if (typeof word === "string") {
        if (txts?.[word]) {
            if (txts[word]?.[currentLang]) {
                return txts[word][currentLang][0].toUpperCase() + txts[word][currentLang].slice(1);
            } else {
                return findFromOtherLangs(txts[word], langs)[0].toUpperCase() + findFromOtherLangs(txts[word], langs).slice(1);
            }
        } else {
            return (txts["translation_not_found"]?.[currentLang][0].toUpperCase() + txts["translation_not_found"]?.[currentLang].slice(1) )|| "translation_not_found";
        }
    } else {
        if (word?.[currentLang]) {
            return word[currentLang][0].toUpperCase() + word[currentLang].slice(1);
        } else {
            const found = findFromOtherLangs(word, langs);
            if (found) {
                return found[0].toUpperCase() + found.slice(1);
            }
            return (txts["translation_not_found"]?.[currentLang][0].toUpperCase() + txts["translation_not_found"]?.[currentLang].slice(1)) || "translation_not_found";
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
