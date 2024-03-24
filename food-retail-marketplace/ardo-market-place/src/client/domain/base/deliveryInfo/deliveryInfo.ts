import {Langs} from "@domain/base/mlString/mlString.ts";
import {txts} from "../../../../server/pkg/core/txts.ts";

export type DeliveryInfo = {
    address: string;
    floor: string;
    apartment: string;
    deliveryComment: string;
}

export function ValidateDeliveryInfo(info: DeliveryInfo, currentLang: Langs): Error | null {
    if (info.address === "") {
        return new Error(txts["delivery_address_required"][currentLang]);
    }
    return null;
}
