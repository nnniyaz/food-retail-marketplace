import {Order} from "@entities/order/order";
import {Langs} from "@entities/base/MlString";
import {txt} from "@shared/core/i18ngen";
import {dateFormat} from "@shared/lib/date/date-format";
import {priceFormat} from "@shared/lib/price/priceFormat";
import {isEmpty} from "lodash";

export function generateMessageFromOrder(order: Order, lang: Langs, from: string): string {
    let msg = '';
    if (isEmpty(order)) {
        return msg;
    }
    msg += `${txt.hello[lang]}, ${order.customerContacts.name}!\n`;
    msg += `${txt.my_name_is[lang]} ${from || "_"} ${txt.from_the_ardo_group_ltd[lang]}\n\n`;
    msg += `${txt.i_am_writing_to_you_about_the_order[lang]} #${order.number} ${txt.made_on[lang]}: ${dateFormat(order.createdAt)}\n\n`;
    msg += `====================\n`;
    msg += `${txt.ordered_products[lang]}:\n\n`;
    order.products.forEach((item, i) => {
        msg += `${i + 1}. ${item.productName[lang]}\n`;
        msg += ` — ${priceFormat(item.pricePerUnit, order.currency)} x ${item.quantity} = ${priceFormat(item.totalPrice, order.currency)}\n`;
    });
    msg += `====================\n\n`;
    msg += `${txt.total[lang]}: ${priceFormat(order.totalPrice, order.currency)}\n\n`;
    return msg;
}
