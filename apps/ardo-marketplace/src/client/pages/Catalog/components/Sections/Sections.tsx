import {Section} from "./components/Section";
import {PublishedCatalog} from "@domain/catalog/catalog";
import classes from "./Sections.module.scss";

interface SectionsProps {
    catalog: PublishedCatalog | null;
}

export const Sections = ({catalog}: SectionsProps) => {
    if (!catalog) {
        return null;
    }
    if (!Object.keys(catalog.sections).length) {
        return null;
    }
    return (
        <ul className={classes.sections}>
            {catalog.structure.map(section => <Section key={section.sectionId} sectionStructure={section}/>)}
        </ul>
    );
};
