import Block from "@components/Block/Block";
import {Langs} from "@/domain/mlString/mlString";
import PieChartSVG from "@assets/chart-pie.svg";
import {translate} from "@/pkg/translate/translate";
import classes from "./NumbersBlock.module.scss";

interface NumbersBlockProps {
    lang: Langs
    title: string
    stats: {
        icon: React.ReactNode
        label: string
        description: string
    }[]
}

export default function NumbersBlock({lang, title, stats}: NumbersBlockProps) {
    return (
        <Block
            title={title}
            tag={{
                label: translate("statistics", lang),
                icon: <PieChartSVG/>
            }}
        >
            <ul className={classes.numbers_block}>
                {
                    stats.map((stat, index) => (
                        <li key={index} className={classes.numbers_block__item}>
                            {stat.icon}
                            <h3>{stat.label}</h3>
                            <p>{stat.description}</p>
                        </li>
                    ))
                }
            </ul>
        </Block>
    )
}
