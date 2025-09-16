import {MlString} from "@domain/base/mlString/mlString.ts";

export type CartItem = {
    id: string;
    name: MlString;
    price: number;
    quantity: number;
    totalPrice: number;
}
