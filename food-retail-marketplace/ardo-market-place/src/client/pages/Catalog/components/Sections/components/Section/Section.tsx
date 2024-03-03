import React from "react";
import CaretRightSVG from "@assets/icons/caret-right.svg?react";
import {Category} from "@domain/category/category";
import {PublishedCatalogSections} from "@domain/catalog/catalog";
import {Section as SectionDomain} from "@domain/sections/section";
import classes from "./Section.module.scss"

interface SectionProps {
    sectionStructure: PublishedCatalogSections
    section: SectionDomain,
    categories: Category,
    expandedSection: string;
    setExpandedSection: React.Dispatch<string>;
}

export const Section = ({sectionStructure, section, categories, expandedSection, setExpandedSection}: SectionProps) => {
    return (
        <li className={classes.section__container} id={`#yakor${sectionStructure.sectionId}`}>
            <div className={classes.section} onClick={() => setExpandedSection(sectionStructure.sectionId)}>
                <img width={30} height={30} src={""} alt="Section" className={classes.section__preview}/>
                <div className={classes.section__info}>
                    <h3 className={classes.section__title}>{section.name}</h3>
                    <CaretRightSVG
                        className={
                            expandedSection === sectionStructure.sectionId
                                ? classes.section__arrow__active
                                : classes.section__arrow
                        }
                    />
                </div>
            </div>
            <ul
                className={
                    expandedSection === sectionStructure.sectionId
                        ? classes.section__categories__active
                        : classes.section__categories
                }
            >
                {sectionStructure.categories.map(category => (
                    <li key={category.categoryId} className={classes.category}>
                        <img width={30} height={30} src={""} alt="Category" className={classes.category__preview}/>
                        <h4 className={classes.category__title}>{category.title}</h4>
                    </li>
                ))}
            </ul>
        </li>
    )
};
