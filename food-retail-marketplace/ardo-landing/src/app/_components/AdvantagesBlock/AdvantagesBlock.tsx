import Image from "next/image";
import {Langs} from "@/domain/mlString/mlString";
import Block from "@components/Block/Block";
import classes from "./AdvantagesBlock.module.scss";

interface AdvantagesBlockProps {
    lang: Langs
    title: string
    tagLabel: string
    cards: AdvantageCardProps[][]
}

export default function AdvantagesBlock({title, tagLabel, cards}: AdvantagesBlockProps) {
    return (
        <Block title={title} tag={{label: tagLabel}}>
            <table className={classes.advantages}>
                <tbody>
                {
                    cards.map((row, index) => (
                        <tr key={index}>
                            {
                                row.map((card, index) => (
                                    <td key={index}>
                                        <AdvantageCard {...card}/>
                                    </td>
                                ))
                            }
                        </tr>
                    ))
                }
                </tbody>
            </table>
        </Block>
    )
}

interface AdvantageCardProps {
    img: string;
    alt: string;
    title: string;
    description: string;
}

function AdvantageCard(props: AdvantageCardProps) {
    return (
        <div className={classes.advantage_card}>
            <div className={classes.advantage_card__preview}>
                <Image
                    className={classes.advantage_card__preview_img}
                    src={props.img}
                    alt={props.alt}
                    width={0}
                    height={0}
                    unoptimized={true}
                />
            </div>
            <h3>{props.title}</h3>
            <p>{props.description}</p>
        </div>
    )
}
