import {useTypedSelector} from "@pkg/hooks/useTypedSelector.ts";
import classes from "./Cart.module.scss";

export const Cart = () => {
    const {cart} = useTypedSelector(state => state.cartState);
    return (
        <div className={classes.cart}>
            <ul className={classes.cart__list}></ul>
            <table className={classes.cart__total}>
                <tbody>
                <tr>
                    <td>Итого:</td>
                    <td>{0}</td>
                </tr>
                </tbody>
            </table>
        </div>
    );
}
