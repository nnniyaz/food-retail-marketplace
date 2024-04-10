import React from "react";
import {Langs} from "@/domain/mlString/mlString";
import FormSVG from "@assets/clipboard-list.svg";
import MailSVG from "@assets/mail.svg";
import UploadSVG from "@assets/inbox-in.svg";
import PercentageSVG from "@assets/receipt-tax.svg";
import ReduceTimeSVG from "@assets/switch-horizontal.svg";
import FastForwardSVG from "@assets/fast-forward.svg";
import {translate} from "@/pkg/translate/translate";
import MainBlock from "@components/MainBlock/MainBlock";
import FormModal from "@components/FormModal/FormModal";
import NumbersBlock from "@components/NumbersBlock/NumbersBlock";
import AdvantagesBlock from "@components/AdvantagesBlock/AdvantagesBlock";
import StepByStepGuide from "@components/StepByStepGuide/StepByStepGuide";

export default function Suppliers() {
    const stats = [
        {
            icon: <PercentageSVG/>,
            label: "HK$26000",
            description: translate("supplier_losses_on_surplus_per_year", Langs.EN),
        },
        {
            icon: <ReduceTimeSVG/>,
            label: "HK$482",
            description: translate("supplier_losses_on_surplus_weekly", Langs.EN),
        },
        {
            icon: <FastForwardSVG/>,
            label: "30%",
            description: translate("of_food_is_lost_but_can_be_turned_into_profit", Langs.EN),
        }
    ];
    const cards = [
        [
            {
                img: "https://ardodev.fra1.cdn.digitaloceanspaces.com/landing/profitability.png",
                alt: "PROFITABILITY",
                title: translate("profitability", Langs.EN),
                description: translate("profitability_description", Langs.EN)
            },
            {
                img: "https://ardodev.fra1.cdn.digitaloceanspaces.com/landing/data-proven-strategry-prices.png",
                alt: "DATA-PROVEN PRICING STRATEGIES",
                title: translate("data_proven_pricing_strategies", Langs.EN),
                description: translate("data_proven_pricing_strategies_description", Langs.EN)
            }
        ],
        [
            {
                img: "https://ardodev.fra1.cdn.digitaloceanspaces.com/landing/risk-free-payment.png",
                alt: "RISK FREE PAYMENT GUARANTEE",
                title: translate("risk_free_payment_guarantee", Langs.EN),
                description: translate("risk_free_payment_guarantee_description", Langs.EN)
            },
            {
                img: "https://ardodev.fra1.cdn.digitaloceanspaces.com/landing/grow-customer-base.png",
                alt: "GROW YOUR CUSTOMER BASE",
                title: translate("grow_your_customer_base", Langs.EN),
                description: translate("grow_your_customer_base__description", Langs.EN)
            }
        ]
    ];
    const instructions = [
        {
            icon: <FormSVG/>,
            label: translate("step_1_fill", Langs.EN),
            description: translate("step_1_fill_description", Langs.EN),
        },
        {
            icon: <UploadSVG/>,
            label: translate("step_2_upload", Langs.EN),
            description: translate("step_2_upload_description", Langs.EN),
        },
        {
            icon: <MailSVG/>,
            label: translate("step_3_receive", Langs.EN),
            description: translate("step_3_receive_description_suppliers", Langs.EN),
        }
    ];
    return (
        <React.Fragment>
            <MainBlock lang={Langs.EN} isSupplierPage={true}/>
            <NumbersBlock lang={Langs.EN} title={translate("food_waste_in_numbers", Langs.EN)} stats={stats}/>
            <AdvantagesBlock
                lang={Langs.EN}
                title={translate("what_business_gets_from_it", Langs.EN)}
                tagLabel={translate("profit_and_new_customers", Langs.EN)}
                cards={cards}
            />
            <StepByStepGuide
                title={translate("step_by_step_guide", Langs.EN)}
                tagLabel={translate("fill_the_form", Langs.EN)}
                instructions={instructions}
            />
        </React.Fragment>
    );
}
