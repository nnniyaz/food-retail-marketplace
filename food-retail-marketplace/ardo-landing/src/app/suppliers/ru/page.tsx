import React from "react";
import {Langs} from "@/domain/mlString/mlString";
import Suppliers from "@components/Pages/Suppliers/Suppliers";


export default function SuppliersLangWrapper() {
    return <Suppliers lang={Langs.RU}/>;
}
