import {StatusHistory} from "@domain/order/order";

export const getLastStatusHistory = (statusHistory: StatusHistory[]): StatusHistory | null => {
    if (!statusHistory?.length) {
        return null;
    }
    return statusHistory.reduce((acc, cur) => acc.updatedAt > cur.updatedAt ? acc : cur);
}
