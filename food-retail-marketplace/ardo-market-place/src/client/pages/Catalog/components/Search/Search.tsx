import {useLocation, useNavigate} from "react-router-dom";
import SearchSVG from "@assets/icons/search.svg?react";
import {useActions} from "@pkg/hooks/useActions.ts";
import {useTypedSelector} from "@pkg/hooks/useTypedSelector.ts";
import {txts} from "../../../../../server/pkg/core/txts.ts";
import classes from "./Search.module.scss";
import {useEffect} from "react";

export const Search = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {currentLang, search} = useTypedSelector(state => state.systemState);
    const {setSearch} = useActions();

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const search = searchParams.get("search");
        if (search) {
            setSearch(search);
        }
    }, []);

    return (
        <search className={classes.search__wrapper}>
            <label className={classes.search}>
                <SearchSVG className={classes.search__icon}/>
                <input
                    type="text"
                    placeholder={txts.search_by_product_name[currentLang]}
                    className={classes.search__input}
                    value={search}
                    onChange={handleSearch}
                    onBlur={() => navigate(search ? `?search=${search}` : "")}
                />
            </label>
        </search>
    )
}
