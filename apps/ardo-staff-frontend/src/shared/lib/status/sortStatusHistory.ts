import {StatusHistory} from "@entities/order/order";

export const sortStatusHistory = (statusHistory: StatusHistory[]): StatusHistory[] => {
    return statusHistory.sort((a, b) => {
        const date1 = new Date(a.updatedAt).getTime();
        const date2 = new Date(b.updatedAt).getTime();
        return date1 - date2;
    });
}
