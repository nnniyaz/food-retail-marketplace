import {useMemo} from "react";
import {ProductItem} from "@widgets/ProductsList";
import {useTypedSelector} from "@pkg/hooks/useTypedSelector.ts";
import classes from "./SearchedProductsList.module.scss";

interface SearchedProductsListProps {
    search: string;
}

export default function SearchedProductsList({search}: SearchedProductsListProps) {
    const {currentLang} = useTypedSelector(state => state.systemState);
    const {catalog} = useTypedSelector(state => state.catalogState);

    const filteredProductIds = useMemo(() => {
        const productIds: string[] = [];
        Object.keys(catalog.products || {}).forEach((productId: string) => {
            if (catalog.products[productId].name[currentLang].toLowerCase().includes(search.toLowerCase())) {
                productIds.push(productId)
            }
        })
        return productIds;
    }, [search]);

    return (
        <div className={classes.products_widget}>
            <div className={classes.products}>
                <section className={classes.products__category}>
                    <ul className={classes.products__list}>
                        {filteredProductIds.map((productId) => (
                            <ProductItem key={productId} product={catalog.products[productId]}/>
                        ))}
                    </ul>
                </section>
            </div>
        </div>
    )
}
