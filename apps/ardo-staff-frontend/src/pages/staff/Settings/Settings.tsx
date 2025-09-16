import {FC} from "react";
import {Card, Select} from "antd";
import {Langs} from "@entities/base/MlString";
import {txt} from "@shared/core/i18ngen";
import {useActions} from "@shared/lib/hooks/useActions";
import {langOptions} from "@shared/lib/options/langOptions";
import {useTypedSelector} from "@shared/lib/hooks/useTypedSelector";
import classes from "@pages/staff/Settings/Settings.module.scss";

export const Settings: FC = () => {
    const {currentLang} = useTypedSelector(state => state.lang);
    const {changeLang, updatePreferredLang} = useActions();

    const onLangChange = (lang: Langs) => {
        changeLang(lang);
        updatePreferredLang(lang);
    }

    return (
        <div className={classes.main}>
            <Card
                title={txt.preferred_lang[currentLang]}
                bodyStyle={{padding: "10px", borderRadius: "8px"}}
                headStyle={{padding: "0 10px"}}
            >
                <Select
                    style={{width: "100px"}}
                    value={currentLang}
                    options={langOptions}
                    onChange={onLangChange}
                />
            </Card>
        </div>
    )
}
