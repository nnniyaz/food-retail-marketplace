import SearchSVG from "@assets/icons/search.svg?react";
import {useTypedSelector} from "@pkg/hooks/useTypedSelector.ts";
import {txts} from "../../../../../server/pkg/core/txts.ts";
import classes from "./Search.module.scss";
import {useActions} from "@pkg/hooks/useActions.ts";

export const Search = () => {
    const {currentLang, search} = useTypedSelector(state => state.systemState);
    const {setSearch} = useActions();
    return (
        <search className={classes.search__wrapper}>
            <label className={classes.search}>
                <SearchSVG className={classes.search__icon}/>
                <input
                    type="text"
                    placeholder={txts.search_by_product_name[currentLang]}
                    className={classes.search__input}
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </label>
        </search>
    )
}
