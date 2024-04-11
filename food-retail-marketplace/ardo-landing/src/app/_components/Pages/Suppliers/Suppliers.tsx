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
import NumbersBlock from "@components/NumbersBlock/NumbersBlock";
import AdvantagesBlock from "@components/AdvantagesBlock/AdvantagesBlock";
import StepByStepGuide from "@components/StepByStepGuide/StepByStepGuide";

interface Props {
    lang: Langs;
}

export default function Suppliers({lang}: Props) {
    const stats = [
        {
            icon: <PercentageSVG/>,
            label: "HK$61,364,134",
            description: translate("advantage_supplier_1", lang),
        },
        {
            icon: <ReduceTimeSVG/>,
            label: "HK$16.767",
            description: translate("advantage_supplier_2", lang),
        },
        {
            icon: <FastForwardSVG/>,
            label: ">70%",
            description: translate("advantage_supplier_3", lang),
        }
    ];
    const cards = [
        [
            {
                img: "https://ardodev.fra1.cdn.digitaloceanspaces.com/landing/profitability.png",
                alt: "PROFITABILITY",
                title: translate("profitability", lang),
                description: translate("profitability_description", lang)
            },
            {
                img: "https://ardodev.fra1.cdn.digitaloceanspaces.com/landing/data-proven-strategry-prices.png",
                alt: "DATA-PROVEN PRICING STRATEGIES",
                title: translate("data_proven_pricing_strategies", lang),
                description: translate("data_proven_pricing_strategies_description", lang)
            }
        ],
        [
            {
                img: "https://ardodev.fra1.cdn.digitaloceanspaces.com/landing/risk-free-payment.png",
                alt: "RISK FREE PAYMENT GUARANTEE",
                title: translate("risk_free_payment_guarantee", lang),
                description: translate("risk_free_payment_guarantee_description", lang)
            },
            {
                img: "https://ardodev.fra1.cdn.digitaloceanspaces.com/landing/grow-customer-base.png",
                alt: "GROW YOUR CUSTOMER BASE",
                title: translate("grow_your_customer_base", lang),
                description: translate("grow_your_customer_base__description", lang)
            }
        ]
    ];
    const instructions = [
        {
            icon: <FormSVG/>,
            label: translate("step_1_fill", lang),
            description: translate("step_1_fill_description", lang),
        },
        {
            icon: <UploadSVG/>,
            label: translate("step_2_upload", lang),
            description: translate("step_2_upload_description", lang),
        },
        {
            icon: <MailSVG/>,
            label: translate("step_3_receive", lang),
            description: translate("step_3_receive_description_suppliers", lang),
        }
    ];
    return (
        <React.Fragment>
            <MainBlock lang={lang} isSupplierPage={true}/>
            <NumbersBlock lang={lang} title={translate("food_waste_in_numbers", lang)} stats={stats}/>
            <AdvantagesBlock
                lang={lang}
                title={translate("what_business_gets_from_it", lang)}
                tagLabel={translate("profit_and_new_customers", lang)}
                cards={cards}
            />
            <StepByStepGuide
                title={translate("step_by_step_guide", lang)}
                tagLabel={translate("fill_the_form", lang)}
                instructions={instructions}
            />
        </React.Fragment>
    );
}
