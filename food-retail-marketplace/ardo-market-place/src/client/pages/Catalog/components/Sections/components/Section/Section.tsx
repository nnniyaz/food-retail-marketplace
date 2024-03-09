import React, {useMemo, useState} from "react";
import {Link} from "react-router-dom";
import CaretRightSVG from "@assets/icons/caret-right.svg?react";
import {RouteNames} from "@pages/index.tsx";
import {PublishedCatalogCategories, PublishedCatalogSections} from "@domain/catalog/catalog";
import {translate} from "@pkg/translate/translate.ts";
import {useActions} from "@pkg/hooks/useActions.ts";
import {useTypedSelector} from "@pkg/hooks/useTypedSelector.ts";
import classes from "./Section.module.scss"

interface SectionProps {
    sectionStructure: PublishedCatalogSections
    expandedSection: string;
    setExpandedSection: React.Dispatch<string>;
}

export const Section = ({sectionStructure, expandedSection, setExpandedSection}: SectionProps) => {
    const {cfg} = useTypedSelector(state => state.systemState);
    const {catalog} = useTypedSelector(state => state.catalogState);
    const [sectionImgError, setSectionImgError] = useState(false);
    const sectionCategoriesHeight = useMemo(() => {
        if (sectionStructure.categories.length === 0) {
            return 0;
        }
        const categoryRowHeight = 136;
        const categoryRows = Math.ceil(sectionStructure.categories.length / 3);
        return categoryRowHeight * categoryRows;
    }, [sectionStructure.categories]);

    return (
        <li className={classes.section__container} id={`${sectionStructure.sectionId}`}>
            <div
                className={classes.section}
                onClick={() => {
                    if (expandedSection === sectionStructure.sectionId) {
                        setExpandedSection("");
                        return;
                    }
                    setExpandedSection(sectionStructure.sectionId)
                }}
            >
                <img
                    className={classes.section__preview}
                    src={""}
                    alt="Section"
                    onError={(e) => {
                        if (!sectionImgError) {
                            e.currentTarget.src = `${cfg.assetsUri}/food_placeholder.png`;
                            setSectionImgError(true);
                        }
                    }}
                />
                <div className={classes.section__info}>
                    <h3 className={classes.section__title}>
                        {translate(catalog.sections[sectionStructure.sectionId].name)}
                    </h3>
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
                style={{height: expandedSection === sectionStructure.sectionId ? `${sectionCategoriesHeight}px` : "0"}}
            >
                {sectionStructure.categories.map(category => {
                    if (!catalog.categories[category.categoryId]) {
                        return null;
                    }
                    return (
                        <SectionCategory
                            key={category.categoryId}
                            sectionStructure={sectionStructure}
                            categoryStructure={category}
                        />
                    )
                })}
            </ul>
        </li>
    )
};

interface SectionCategoryProps {
    sectionStructure: PublishedCatalogSections
    categoryStructure: PublishedCatalogCategories
}

const SectionCategory = ({sectionStructure, categoryStructure}: SectionCategoryProps) => {
    const {cfg} = useTypedSelector(state => state.systemState);
    const {catalog} = useTypedSelector(state => state.catalogState);
    const {setCurrentSection, setCurrentCategory} = useActions();
    const [categoryImgError, setCategoryImgError] = useState(false);

    const handleCategoryClick = (categoryStructure: PublishedCatalogCategories) => {
        setCurrentSection(sectionStructure);
        setCurrentCategory(categoryStructure);
    }

    return (
        <li
            key={categoryStructure.categoryId}
            className={classes.category__container}
            onClick={() => handleCategoryClick(categoryStructure)}
        >
            <Link
                className={classes.category}
                to={RouteNames.LIST
                    .replace(":sectionName", catalog.sections[sectionStructure.sectionId].name.EN.replace(" ", "-").toLowerCase())
                    .replace(":sectionId", sectionStructure.sectionId)
                }
            >
                <img
                    className={classes.category__preview}
                    src={""}
                    alt="Category"
                    onError={(e) => {
                        if (!categoryImgError) {
                            e.currentTarget.src = `${cfg.assetsUri}/food_placeholder.png`;
                            setCategoryImgError(true);
                        }
                    }}
                />
                <h4 className={classes.category__title}>
                    {translate(catalog.categories[categoryStructure.categoryId].name)}
                </h4>
            </Link>
        </li>
    )
}
