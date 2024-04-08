import React from "react";
import {Langs} from "@/domain/mlString/mlString";
import PercentageSVG from "@assets/receipt-tax.svg";
import ReduceTimeSVG from "@assets/switch-horizontal.svg";
import FastForwardSVG from "@assets/fast-forward.svg";
import CartSVG from "@assets/shopping-cart.svg";
import ConfirmSVG from "@assets/check-circle.svg";
import ArchiveSVG from "@assets/archive.svg";
import {translate} from "@/pkg/translate/translate";
import MainBlock from "@components/MainBlock/MainBlock";
import NumbersBlock from "@components/NumbersBlock/NumbersBlock";
import AdvantagesBlock from "@components/AdvantagesBlock/AdvantagesBlock";
import StepByStepGuide from "@components/StepByStepGuide/StepByStepGuide";

export default function Restaurants() {
    const stats = [
        {
            icon: <PercentageSVG/>,
            label: "50-60%",
            description: translate("discounts_on_products_every_day", Langs.EN),
        },
        {
            icon: <ReduceTimeSVG/>,
            label: "2X",
            description: translate("reduce_order_creating_time_by_2_times", Langs.EN),
        },
        {
            icon: <FastForwardSVG/>,
            label: "2 min",
            description: translate("get_started_in_no_time", Langs.EN),
        }
    ];
    const cards = [
        [
            {
                img: "https://ardodev.fra1.cdn.digitaloceanspaces.com/landing/reduce-costs.png",
                alt: "REDUCE YOUR FOOD COSTS",
                title: translate("reduce_your_food_costs", Langs.EN),
                description: translate("reduce_your_food_costs_description", Langs.EN)
            },
            {
                img: "https://ardodev.fra1.cdn.digitaloceanspaces.com/landing/grow-network.png",
                alt: "GROW YOUR SUPPLIER’S NETWORK",
                title: translate("grow_your_suppliers_network", Langs.EN),
                description: translate("grow_your_suppliers_network_description", Langs.EN)
            }
        ],
        [
            {
                img: "https://ardodev.fra1.cdn.digitaloceanspaces.com/landing/cashflow.png",
                alt: "CASHFLOW & REBATE",
                title: translate("cashflow_and_rebate", Langs.EN),
                description: translate("cashflow_and_rebate_description", Langs.EN)
            },
            {
                img: "https://ardodev.fra1.cdn.digitaloceanspaces.com/landing/save-time.png",
                alt: "SAVE TIME",
                title: translate("save_time", Langs.EN),
                description: translate("save_time_description", Langs.EN)
            }
        ],
        [
            {
                img: "https://ardodev.fra1.cdn.digitaloceanspaces.com/landing/location.png",
                alt: "ANYTIME. ANYWHERE.",
                title: translate("anytime_anywhere", Langs.EN),
                description: translate("anytime_anywhere_description", Langs.EN)
            },
            {
                img: "https://ardodev.fra1.cdn.digitaloceanspaces.com/landing/support.png",
                alt: "24/7 CUSTOMER SUPPORT",
                title: "24 / 7" + " " + translate("customer_support", Langs.EN),
                description: translate("customer_support_description", Langs.EN)
            }
        ]
    ];
    const instructions = [
        {
            icon: <CartSVG/>,
            label: translate("step_1_pick", Langs.EN),
            description: translate("step_1_pick_description", Langs.EN),
        },
        {
            icon: <ConfirmSVG/>,
            label: translate("step_2_confirm", Langs.EN),
            description: translate("step_2_confirm_description", Langs.EN),
        },
        {
            icon: <ArchiveSVG/>,
            label: translate("step_3_receive", Langs.EN),
            description: translate("step_3_receive_description_restaurants", Langs.EN),
        }
    ];
    return (
        <React.Fragment>
            <MainBlock lang={Langs.EN} isSupplierPage={false}/>
            <NumbersBlock lang={Langs.EN} title={translate("ardo_in_numbers", Langs.EN)} stats={stats}/>
            <AdvantagesBlock
                lang={Langs.EN}
                title={translate("what_restaurants_get_from_it", Langs.EN)}
                tagLabel={translate("discount_and_optimisation", Langs.EN)}
                cards={cards}
            />
            <StepByStepGuide
                title={translate("step_by_step_guide", Langs.EN)}
                tagLabel={translate("start_ordering", Langs.EN)}
                instructions={instructions}
            />
        </React.Fragment>
    );
}
