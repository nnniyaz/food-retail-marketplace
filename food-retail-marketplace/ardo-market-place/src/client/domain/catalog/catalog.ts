import lodash from "lodash";
import {Product, ValidateProduct} from "@domain/product/product";
import {Category, ValidateCategory} from "@domain/category/category";
import {Section, ValidateSection} from "@domain/sections/section";
import {Slide, ValidateSlide} from "@domain/slides/slide.ts";

const {isEmpty} = lodash;

export type PublishedCatalog = {
    _id: string;
    catalogId: string;
    structure: PublishedCatalogSections[];
    promo: PublishedCatalogSections[];
    sections: { [sectionId: string]: Section };
    categories: { [categoryId: string]: Category };
    products: { [productId: string]: Product };
    slides: Slide[];
    orderSettings: {
        moq: {
            fee: number;
            freeFrom: number;
        };
    }
    publishedAt: string;
}

export type PublishedCatalogSections = {
    sectionId: string;
    categories: PublishedCatalogCategories[];
}

export type PublishedCatalogCategories = {
    categoryId: string;
    products: PublishedCatalogProducts[];
}

export type PublishedCatalogProducts = {
    productId: string;
}

export function ValidatePublishedCatalogSections(sections: PublishedCatalogSections): Error | null {
    if (!sections.sectionId) {
        throw new Error("Catalog's SectionId is invalid");
    }
    if (!Array.isArray(sections.categories)) {
        throw new Error("Catalog's Categories must be an array");
    }
    return null;
}

export function ValidatePublishedCatalogCategories(categories: PublishedCatalogCategories): Error | null {
    if (!categories.categoryId) {
        throw new Error("Catalog's CategoryId is invalid");
    }
    if (!Array.isArray(categories.products)) {
        throw new Error("Catalog's Products must be an array");
    }
    return null;
}

export function ValidatePublishedCatalogProducts(products: PublishedCatalogProducts): Error | null {
    if (!products.productId) {
        throw new Error("Catalog's ProductId is invalid");
    }
    return null;
}

export function ValidatePublishedCatalog(catalog: PublishedCatalog): Error | null {
    if (!catalog.catalogId) {
        throw new Error("CatalogId is invalid");
    }
    if (isEmpty(catalog.structure)) {
        throw new Error("Structure is invalid");
    }
    if (!Array.isArray(catalog.structure)) {
        throw new Error("Structure must be an array");
    }
    let err: Error | null = null;
    catalog.structure.forEach(section => {
        err = ValidatePublishedCatalogSections(section);
        if (err !== null) {
            throw err;
        }
        section.categories.forEach(category => {
            err = ValidatePublishedCatalogCategories(category);
            if (err !== null) {
                throw err;
            }
            category.products.forEach(product => {
                err = ValidatePublishedCatalogProducts(product);
                if (err !== null) {
                    throw err;
                }
            });
        });
    });
    catalog.promo.forEach(section => {
        err = ValidatePublishedCatalogSections(section);
        if (err !== null) {
            throw err;
        }
        section.categories.forEach(category => {
            err = ValidatePublishedCatalogCategories(category);
            if (err !== null) {
                throw err;
            }
            category.products.forEach(product => {
                err = ValidatePublishedCatalogProducts(product);
                if (err !== null) {
                    throw err;
                }
            });
        });
    });
    if (isEmpty(catalog.sections)) {
        throw new Error("Sections is invalid");
    }
    Object.keys(catalog.sections).forEach(sectionId => {
        err = ValidateSection(catalog.sections[sectionId]);
        if (err !== null) {
            throw err;
        }
    })
    if (isEmpty(catalog.categories)) {
        throw new Error("Categories is invalid");
    }
    Object.keys(catalog.categories).forEach(categoryId => {
        err = ValidateCategory(catalog.categories[categoryId]);
        if (err !== null) {
            throw err;
        }
    })
    if (isEmpty(catalog.products)) {
        throw new Error("Products is invalid");
    }
    Object.keys(catalog.products).forEach(productId => {
        if (!ValidateProduct(catalog.products[productId])) return false;
    })
    if (!Array.isArray(catalog.slides)) {
        throw new Error("Slides is invalid");
    }
    catalog.slides?.forEach(slide => {
        err = ValidateSlide(slide);
        if (err !== null) {
            throw err;
        }
    });
    return null;
}
