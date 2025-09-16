import {useEffect, useMemo, useState} from "react";
import {ProductItem} from "@widgets/ProductsList";
import {useTypedSelector} from "@pkg/hooks/useTypedSelector.ts";
import classes from "./SearchedProductsList.module.scss";
import {translate} from "@pkg/translate/translate.ts";

interface SearchedProductsListProps {
    search: string;
}

export default function SearchedProductsList({search}: SearchedProductsListProps) {
    const {currentLang, langs} = useTypedSelector(state => state.systemState);
    const {catalog} = useTypedSelector(state => state.catalogState);
    const [loading, setLoading] = useState(false);

    const filteredProductIds = useMemo(() => {
        const productIds: string[] = [];
        Object.keys(catalog.products || {}).forEach((productId: string) => {
            if (catalog.products[productId].name[currentLang].toLowerCase().includes(search.toLowerCase())) {
                productIds.push(productId)
            }
        })
        return productIds;
    }, [search]);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 750);
    }, [search]);

    return (
        <div className={classes.products_widget}>
            <div className={classes.products}>
                <section className={classes.products__category}>
                    {!!filteredProductIds?.length ? (
                        <ul className={classes.products__list}>
                            {filteredProductIds.map((productId) => (
                                <ProductItem key={productId} product={catalog.products[productId]} loading={loading}/>
                            ))}
                        </ul>
                    ) : (
                        <p className={classes.products__not_found}>
                            {translate("products_not_found", currentLang, langs)}
                        </p>
                    )}
                </section>
            </div>
        </div>
    )
}
