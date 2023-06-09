import {FC} from "react";
import {Select} from "antd";
import {LangsList} from "entities/base/MlString";
import {useActions} from "shared/lib/hooks/useActions";
import {useTypedSelector} from "shared/lib/hooks/useTypedSelector";
import classes from "./ChangeLang.module.scss";

export const ChangeLang: FC = () => {
    const {currentLang} = useTypedSelector(state => state.lang);
    const {changeLang} = useActions();
    const options = [
        {value: LangsList.RU, label: LangsList.RU},
        {value: LangsList.EN, label: LangsList.EN},
    ]

    return <Select value={currentLang} onChange={changeLang} options={options} className={classes.select}/>
}
