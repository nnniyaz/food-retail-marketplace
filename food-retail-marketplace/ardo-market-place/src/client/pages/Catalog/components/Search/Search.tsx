import SearchSVG from "@assets/icons/search.svg?react";
import classes from "./Search.module.scss";

export const Search = () => {
    return (
        <search className={classes.search__wrapper}>
            <label className={classes.search}>
                <SearchSVG className={classes.search__icon}/>
                <input
                    type="text"
                    placeholder="Search in Restolink"
                    className={classes.search__input}
                />
            </label>
        </search>
    )
}
