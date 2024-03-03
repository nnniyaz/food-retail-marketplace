import PlusSVG from "@assets/icons/plus.svg?react";
import classes from "./Products.module.scss";

export const Products = () => {
    return (
        <div className={classes.products}>
            <section className={classes.products__section}>
                <h2>Buy your favorite products</h2>
                <ul className={classes.products__list}>
                    <Product/>
                    <Product/>
                    <Product/>
                    <Product/>
                    <Product/>
                </ul>
            </section>
            <section className={classes.products__section}>
                <h2>New Products</h2>
                <ul className={classes.products__list}>
                    <Product/>
                    <Product/>
                    <Product/>
                    <Product/>
                    <Product/>
                </ul>
            </section>
            <section className={classes.products__section}>
                <h2>Recommended</h2>
                <ul className={classes.products__list}>
                    <Product/>
                    <Product/>
                    <Product/>
                    <Product/>
                    <Product/>
                </ul>
            </section>
        </div>
    );
}

const Product = () => {
    return (
        <li className={classes.product}>
            <img
                width={175}
                height={175}
                src="https://arbuz.kz/image/s3/arbuz-kz-products/19445-001-s.jpg?w=360&h=360&_c=1705328654"
                alt="Product"
                className={classes.product__img}
            />
            <div className={classes.product__info}>
                <p className={classes.product__title}>Bananas</p>
                <p className={classes.product__price_per_unit}>
                    <span className={classes.product__price_per_unit__price}>$30/kg</span>
                    <span className={classes.product__price_per_unit__moq}>• 1 pc</span>
                </p>
                <p className={classes.product__total_price_of_product}>$30</p>
                <button className={classes.product__add}>
                    <span className={classes.product__add__text}>Add</span>
                    <PlusSVG className={classes.product__add__plus}/>
                </button>
            </div>
        </li>
    )
}
