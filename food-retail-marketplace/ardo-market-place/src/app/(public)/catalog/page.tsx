"use client";
import React, {useState} from "react";
import {Search} from "@/app/_ui/Search";
import {Section} from "./_components/Sections/_components/Section";
import classes from "./Catalog.module.scss";

export default function Catalog() {
    const [expandedSection, setExpandedSection] = useState(1);

    const sections = [
        {
            id: 1,
            title: "Section 1",
            imgUrl: "preview1",
            categories: [
                {
                    id: 1,
                    title: "Category 1",
                    imgUrl: "category1"
                },
                {
                    id: 2,
                    title: "Category 2",
                    imgUrl: "category2"
                },
                {
                    id: 3,
                    title: "Category 3",
                    imgUrl: "category3"
                }
            ]
        },
        {
            id: 2,
            title: "Section 2",
            imgUrl: "preview2",
            categories: [
                {
                    id: 4,
                    title: "Category 4",
                    imgUrl: "category4"
                },
                {
                    id: 5,
                    title: "Category 5",
                    imgUrl: "category5"
                },
                {
                    id: 6,
                    title: "Category 6",
                    imgUrl: "category6"
                }
            ]
        },
        {
            id: 3,
            title: "Section 3",
            imgUrl: "preview3",
            categories: [
                {
                    id: 7,
                    title: "Category 7",
                    imgUrl: "category7"
                },
                {
                    id: 8,
                    title: "Category 8",
                    imgUrl: "category8"
                },
                {
                    id: 9,
                    title: "Category 9",
                    imgUrl: "category9"
                }
            ]
        },
        {
            id: 4,
            title: "Section 4",
            imgUrl: "preview4",
            categories: [
                {
                    id: 10,
                    title: "Category 10",
                    imgUrl: "category10"
                },
                {
                    id: 11,
                    title: "Category 11",
                    imgUrl: "category11"
                },
                {
                    id: 12,
                    title: "Category 12",
                    imgUrl: "category12"
                }
            ]
        },
        {
            id: 5,
            title: "Section 5",
            imgUrl: "preview5",
            categories: [
                {
                    id: 13,
                    title: "Category 13",
                    imgUrl: "category13"
                },
                {
                    id: 14,
                    title: "Category 14",
                    imgUrl: "category14"
                },
                {
                    id: 15,
                    title: "Category 15",
                    imgUrl: "category15"
                }
            ]
        },
        {
            id: 6,
            title: "Section 6",
            imgUrl: "preview6",
            categories: [
                {
                    id: 16,
                    title: "Category 16",
                    imgUrl: "category16"
                },
                {
                    id: 17,
                    title: "Category 17",
                    imgUrl: "category17",
                },
            ]
        },
        {
            id: 7,
            title: "Section 7",
            imgUrl: "preview7",
            categories: [
                {
                    id: 18,
                    title: "Category 18",
                    imgUrl: "category18"
                },
                {
                    id: 19,
                    title: "Category 19",
                    imgUrl: "category19"
                },
                {
                    id: 20,
                    title: "Category 20",
                    imgUrl: "category20"
                }
            ]
        },
        {
            id: 8,
            title: "Section 8",
            imgUrl: "preview8",
            categories: [
                {
                    id: 21,
                    title: "Category 21",
                    imgUrl: "category21"
                },
                {
                    id: 22,
                    title: "Category 22",
                    imgUrl: "category22"
                },
                {
                    id: 23,
                    title: "Category 23",
                    imgUrl: "category23"
                }
            ]
        },
        {
            id: 9,
            title: "Section 9",
            imgUrl: "preview9",
            categories: [
                {
                    id: 24,
                    title: "Category 24",
                    imgUrl: "category24"
                },
                {
                    id: 25,
                    title: "Category 25",
                    imgUrl: "category25"
                },
                {
                    id: 26,
                    title: "Category 26",
                    imgUrl: "category26"
                }
            ]
        }
    ]

    return (
        <React.Fragment>
            <Search/>
            <ul className={classes.sections}>
                {sections.map(section => (
                    <Section
                        key={section.id}
                        section={section}
                        expandedSection={expandedSection}
                        setExpandedSection={setExpandedSection}
                    />
                ))}
            </ul>
        </React.Fragment>
    )
}
