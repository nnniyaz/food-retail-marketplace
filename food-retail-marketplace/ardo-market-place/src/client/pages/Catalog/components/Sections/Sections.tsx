// import {useState} from 'react';
// import {Section} from "./components/Section";
import {PublishedCatalog} from "@domain/catalog/catalog";
// import classes from "./Sections.module.scss";

interface SectionsProps {
    catalog: PublishedCatalog | null;
}

export const Sections = ({catalog}: SectionsProps) => {
    // const [expandedSection, setExpandedSection] = useState<string>("");
    if (!catalog) {
        return null;
    }
    return (
        <></>
        // <ul className={classes.sections}>
        //     {catalog.structure.map(section => (
        //         <Section
        //             key={section.sectionId}
        //             sectionStructure={section}
        //             section={catalog.sections[section.sectionId]}
        //             category={catalog.categories}
        //             expandedSection={expandedSection}
        //             setExpandedSection={setExpandedSection}
        //         />
        //     ))}
        // </ul>
    );
};
