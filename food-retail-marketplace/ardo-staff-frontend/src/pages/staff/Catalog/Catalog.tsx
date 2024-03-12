import {FC, useEffect} from "react";
import {useTypedSelector} from "@shared/lib/hooks/useTypedSelector";
import {useActions} from "@shared/lib/hooks/useActions";
import {useNavigate} from "react-router-dom";

export const Catalog: FC = () => {
    const navigate = useNavigate();
    const {catalog, isLoadingGetCatalog} = useTypedSelector(state => state.catalog);
    const {fetchCatalogs} = useActions();

    useEffect(() => {
        const controller = new AbortController();
        fetchCatalogs({offset: 0, limit: 0}, controller, {navigate: navigate});
        return () => controller.abort();
    }, []);

    return (
        <div>
            Catalog
        </div>
    )
}
