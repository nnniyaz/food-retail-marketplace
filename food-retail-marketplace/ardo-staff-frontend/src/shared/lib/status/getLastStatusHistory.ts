import {StatusHistory} from "@entities/order/order";
import {isEmpty} from "lodash";

export const getLastStatusHistory = (statusHistory: StatusHistory[]): StatusHistory | null => {
    if (isEmpty(statusHistory)) {
        return null;
    }
    return statusHistory.reduce((acc, cur) => acc.updatedAt > cur.updatedAt ? acc : cur);
}
