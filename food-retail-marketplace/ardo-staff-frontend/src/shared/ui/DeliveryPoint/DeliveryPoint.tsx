import classes from "./DeliveryPoint.module.scss";
import {useTypedSelector} from "@shared/lib/hooks/useTypedSelector";
import {txt} from "@shared/core/i18ngen";

interface DeliveryPointProps {
    address: string;
    floor: string;
    apartment: string;
    deliveryComment: string;
}

export const DeliveryPoint = ({address, floor, apartment, deliveryComment}: DeliveryPointProps) => {
    const {currentLang} = useTypedSelector(state => state.lang);
    const deliveryPoint = [
        {label: txt.address[currentLang], value: address},
        {label: txt.floor[currentLang], value: floor},
        {label: txt.apartment[currentLang], value: apartment},
        {label: txt.delivery_comment[currentLang], value: deliveryComment}
    ];
    return (
        <div className={classes.delivery__point}>
            {deliveryPoint.map((point) => (
                <DeliveryPointRow label={point.label} value={point.value}/>
            ))}
        </div>
    )
}

const DeliveryPointRow = ({label, value}: { label: string, value: string }) => {
    return (
        <div className={classes.delivery__point__row}>
            <div className={classes.delivery__point__row__label}>{`${label}:`}</div>
            <div className={classes.delivery__point__row__value}>{value}</div>
        </div>
    )
}
