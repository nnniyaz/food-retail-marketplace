import CursorClickSVG from "@assets/cursor-click.svg";
import Block from "@components/Block/Block";
import classes from "./StepByStepGuide.module.scss";

interface StepByStepGuideProps {
    title: string
    tagLabel: string
    instructions: {
        icon: React.ReactNode
        label: string
        description: string
    }[]
}

export default function StepByStepGuide({title, tagLabel, instructions}: StepByStepGuideProps) {
    return (
        <Block
            title={title}
            tag={{
                label: tagLabel,
                icon: <CursorClickSVG/>
            }}
        >
            <ul className={classes.instructions_block}>
                {
                    instructions.map((instruction, index) => (
                        <li key={index} className={classes.instructions_block__item}>
                            {instruction.icon}
                            <h3>{instruction.label}</h3>
                            <p>{instruction.description}</p>
                        </li>
                    ))
                }
            </ul>
        </Block>
    )
}
