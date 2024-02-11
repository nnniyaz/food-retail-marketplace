import React from "react";
import Image from "next/image";
import CaretRightSVG from "@/assets/icons/caret-right.svg";
import classes from "./Section.module.scss"

interface SectionProps {
    section: {
        id: number,
        title: string,
        imgUrl: string,
        categories: {
            id: number,
            title: string,
            imgUrl: string
        }[]
    },
    expandedSection: number;
    setExpandedSection: React.Dispatch<number>;
}

export const Section = ({section, expandedSection, setExpandedSection}: SectionProps) => {
    return (
        <li className={classes.section__container} id={`#yakor${section.id}`}>
            <div className={classes.section} onClick={() => setExpandedSection(section.id)}>
                <Image width={30} height={30} src={""} alt="Section" className={classes.section__preview}/>
                <div className={classes.section__info}>
                    <h3 className={classes.section__title}>{section.title}</h3>
                    <CaretRightSVG className={
                        expandedSection === section.id ? classes.section__arrow__active : classes.section__arrow
                    }/>
                </div>
            </div>
            <ul className={
                expandedSection === section.id ? classes.section__categories__active : classes.section__categories
            }>
                {section.categories.map(category => (
                    <li key={category.id} className={classes.category}>
                        <Image width={30} height={30} src={""} alt="Category" className={classes.category__preview}/>
                        <h4 className={classes.category__title}>{category.title}</h4>
                    </li>
                ))}
            </ul>
        </li>
    )
};
