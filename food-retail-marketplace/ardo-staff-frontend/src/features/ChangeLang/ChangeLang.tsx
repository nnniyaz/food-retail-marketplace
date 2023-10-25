import {FC} from "react";
import {Select} from "antd";
import {Lang} from "@entities/base/MlString";
import {useActions} from "@shared/lib/hooks/useActions";
import {useTypedSelector} from "@shared/lib/hooks/useTypedSelector";
import classes from "./ChangeLang.module.scss";

export const ChangeLang: FC = () => {
    const {currentLang} = useTypedSelector(state => state.lang);
    const {changeLang} = useActions();
    const options = [
        {value: Lang.RU, label: Lang.RU},
        {value: Lang.EN, label: Lang.EN},
    ]

    return <Select value={currentLang} onChange={changeLang} options={options} className={classes.select}/>
}
