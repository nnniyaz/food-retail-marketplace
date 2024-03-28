import React, {useState} from "react";
import {RouteNames} from "@pages/index.tsx";
import {ReturnButton} from "@widgets/ReturnButton";
import {translate} from "@pkg/translate/translate.ts";
import {priceFormat} from "@pkg/formats/price/priceFormat.ts";
import {cartTotalPrice} from "@pkg/cartPrice/cartPrice.tsx";
import {CartItem} from "@domain/cartItem";
import classes from "./Success.module.scss";

export const Success = () => {
    const [successCart] = useState<CartItem[]>(JSON.parse(localStorage.getItem("ardo-market-place-success-cart")) || []);
    return (
        <React.Fragment>
            <ReturnButton
                to={RouteNames.HOME}
                title={translate("thank_you_for_your_order")}
            />

            <div className={classes.cheque}>
                <table>
                    <thead>
                    <tr>
                        <th>
                            {translate("name")}
                        </th>
                        <th>
                            {translate("total")}
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {successCart.map((item) => (
                        <tr key={item.id}>
                            <td>{translate(item.name)}</td>
                            <td>
                                <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
                                    <p>{`${priceFormat(item.price)} x ${item.quantity}`}</p>
                                    <p>{priceFormat(item.totalPrice)}</p>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                    <tfoot>
                    <tr>
                        <td>{translate("total")}</td>
                        <td>{priceFormat(cartTotalPrice(successCart))}</td>
                    </tr>
                    </tfoot>
                </table>
            </div>
        </React.Fragment>
    );
}
