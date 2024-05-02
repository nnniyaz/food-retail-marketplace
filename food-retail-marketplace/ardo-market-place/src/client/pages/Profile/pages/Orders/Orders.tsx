import React, {useEffect} from "react";
import {Skeleton} from "antd";
import {RouteNames} from "@pages/index.tsx";
import {translate} from "@pkg/translate/translate.ts";
import {useActions} from "@pkg/hooks/useActions.ts";
import {dateFormat} from "@pkg/formats/date/dateFormat.ts";
import {useTypedSelector} from "@pkg/hooks/useTypedSelector.ts";
import {ReturnButton} from "@widgets/ReturnButton";
import classes from "./Orders.module.scss";
import {priceFormat} from "@pkg/formats/price/priceFormat.ts";

export const Orders = () => {
    const {currentLang, langs, currency} = useTypedSelector(state => state.systemState);
    const {orders, isLoading} = useTypedSelector(state => state.orderHistoryState);
    const {fetchOrders} = useActions();

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <React.Fragment>
            <ReturnButton
                to={RouteNames.PROFILE}
                title={translate("previous_orders", currentLang, langs)}
            />

            {
                isLoading
                    ?
                    <ul className={classes.orders_list}>
                        {
                            Array(3).fill(0).map(() => (
                                <li className={classes.orders_list__item}>
                                    <Skeleton style={{width: "100%", height: "100%"}}/>
                                </li>
                            ))
                        }
                    </ul>
                    :
                    <ul className={classes.orders_list}>
                        {
                            !orders?.length
                                ?
                                <li style={{
                                    height: "200px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    textAlign: "center",
                                    listStyle: "none"
                                }}>
                                    <h2>{translate("no_orders", currentLang, langs)}</h2>
                                </li>
                                :
                                orders.reverse().map((order) => (
                                    <li className={classes.orders_list__item} key={order.id}>
                                        <div className={classes.orders_list__item__row}>
                                            <p className={classes.orders_list__item__row__label}>
                                                {translate("order_number", currentLang, langs)}
                                            </p>
                                            <p
                                                className={classes.orders_list__item__row__value}
                                                style={{fontWeight: "700"}}
                                            >
                                                {order.number}
                                            </p>
                                        </div>
                                        <div className={classes.orders_list__item__row}>
                                            <p className={classes.orders_list__item__row__label}>
                                                {translate("order_date", currentLang, langs)}
                                            </p>
                                            <p className={classes.orders_list__item__row__value}>
                                                {dateFormat(order.createdAt)}
                                            </p>
                                        </div>
                                        <div className={classes.orders_list__item__row}>
                                            <p className={classes.orders_list__item__row__label}>
                                                {translate("order_status", currentLang, langs)}
                                            </p>
                                            <p className={classes.orders_list__item__row__value}>
                                                {order.status}
                                            </p>
                                        </div>
                                        <div className={classes.orders_list__item__row} style={{padding: "5px 0"}}>
                                            <table>
                                                <tbody>
                                                {
                                                    order.products.map((product, index) => (
                                                        <tr key={product.productId}>
                                                            <td>{`${index + 1}.`}</td>
                                                            <td>
                                                                <div>{translate(product.productName, currentLang, langs)}</div>
                                                                <div className={classes.dots}></div>
                                                                <div>{`x${product.quantity}`}</div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                }
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className={classes.orders_list__item__row}>
                                            <p className={classes.orders_list__item__row__label}>
                                                {translate("total", currentLang, langs)}
                                            </p>
                                            <p
                                                className={classes.orders_list__item__row__value}
                                                style={{fontWeight: "700"}}
                                            >
                                                {priceFormat(order.totalPrice, currency)}
                                            </p>
                                        </div>
                                    </li>
                                ))
                        }
                    </ul>
            }
        </React.Fragment>
    )
}
