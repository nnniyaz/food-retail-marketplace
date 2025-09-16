import {FC} from "react";
import {Select} from "antd";
import {useActions} from "@shared/lib/hooks/useActions";
import {langOptions} from "@shared/lib/options/langOptions";
import {useTypedSelector} from "@shared/lib/hooks/useTypedSelector";
import classes from "./ChangeLang.module.scss";

export const ChangeLang: FC = () => {
    const {currentLang} = useTypedSelector(state => state.lang);
    const {changeLang} = useActions();

    return <Select value={currentLang} onChange={changeLang} options={langOptions} className={classes.select}/>
}
