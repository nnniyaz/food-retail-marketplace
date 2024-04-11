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

interface Props {
    lang: Langs;
}

export default function Restaurants({lang}: Props) {
    const stats = [
        {
            icon: <PercentageSVG/>,
            label: "50-60%",
            description: translate("advantage_restaurant_1", lang),
        },
        {
            icon: <ReduceTimeSVG/>,
            label: "> 10",
            description: translate("advantage_restaurant_2", lang),
        },
        {
            icon: <FastForwardSVG/>,
            label: "75% → 87%",
            description: translate("advantage_restaurant_3", lang),
        }
    ];
    const cards = [
        [
            {
                img: "https://ardodev.fra1.cdn.digitaloceanspaces.com/landing/reduce-costs.png",
                alt: "REDUCE YOUR FOOD COSTS",
                title: translate("reduce_your_food_costs", lang),
                description: translate("reduce_your_food_costs_description", lang)
            },
            {
                img: "https://ardodev.fra1.cdn.digitaloceanspaces.com/landing/grow-network.png",
                alt: "GROW YOUR SUPPLIER’S NETWORK",
                title: translate("grow_your_suppliers_network", lang),
                description: translate("grow_your_suppliers_network_description", lang)
            }
        ],
        [
            {
                img: "https://ardodev.fra1.cdn.digitaloceanspaces.com/landing/cashflow.png",
                alt: "CASHFLOW & REBATE",
                title: translate("cashflow_and_rebate", lang),
                description: translate("cashflow_and_rebate_description", lang)
            },
            {
                img: "https://ardodev.fra1.cdn.digitaloceanspaces.com/landing/save-time.png",
                alt: "SAVE TIME",
                title: translate("save_time", lang),
                description: translate("save_time_description", lang)
            }
        ],
        [
            {
                img: "https://ardodev.fra1.cdn.digitaloceanspaces.com/landing/location.png",
                alt: "ANYTIME. ANYWHERE.",
                title: translate("anytime_anywhere", lang),
                description: translate("anytime_anywhere_description", lang)
            },
            {
                img: "https://ardodev.fra1.cdn.digitaloceanspaces.com/landing/support.png",
                alt: "24/7 CUSTOMER SUPPORT",
                title: "24 / 7" + " " + translate("customer_support", lang),
                description: translate("customer_support_description", lang)
            }
        ]
    ];
    const instructions = [
        {
            icon: <CartSVG/>,
            label: translate("step_1_pick", lang),
            description: translate("step_1_pick_description", lang),
        },
        {
            icon: <ConfirmSVG/>,
            label: translate("step_2_confirm", lang),
            description: translate("step_2_confirm_description", lang),
        },
        {
            icon: <ArchiveSVG/>,
            label: translate("step_3_receive", lang),
            description: translate("step_3_receive_description_restaurants", lang),
        }
    ];
    return (
        <React.Fragment>
            <MainBlock lang={lang} isSupplierPage={false}/>
            <NumbersBlock lang={lang} title={translate("ardo_in_numbers", lang)} stats={stats}/>
            <AdvantagesBlock
                lang={lang}
                title={translate("what_restaurants_get_from_it", lang)}
                tagLabel={translate("discount_and_optimisation", lang)}
                cards={cards}
            />
            <StepByStepGuide
                title={translate("step_by_step_guide", lang)}
                tagLabel={translate("start_ordering", lang)}
                instructions={instructions}
            />
        </React.Fragment>
    );
}
