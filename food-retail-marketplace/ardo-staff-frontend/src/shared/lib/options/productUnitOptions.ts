import {ProductUnit} from "@entities/product/product";

export const productUnitOptions = [
    {value: ProductUnit.PC, label: ProductUnit.PC.toLowerCase()},
    {value: ProductUnit.KG, label: ProductUnit.KG.toLowerCase()},
    {value: ProductUnit.LB, label: ProductUnit.LB.toLowerCase()},
    {value: ProductUnit.CASE, label: ProductUnit.CASE.toLowerCase()},
    {value: ProductUnit.PUNNET, label: ProductUnit.PUNNET.toLowerCase()},
    {value: ProductUnit.PACK, label: ProductUnit.PACK.toLowerCase()},
];
