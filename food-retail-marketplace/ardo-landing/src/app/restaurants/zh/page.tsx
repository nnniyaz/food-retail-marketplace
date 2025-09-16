import React from "react";
import Restaurants from "@components/Pages/Restaurants/Restaurants";
import {Langs} from "@/domain/mlString/mlString";


export default function RestaurantsLangWrapper() {
    return <Restaurants lang={Langs.ZH}/>;
}
