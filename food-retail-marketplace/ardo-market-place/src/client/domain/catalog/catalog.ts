import {Product, ValidateProduct} from "@domain/product/product";
import {Category, ValidateCategory} from "@domain/category/category";
import {Section, ValidateSection} from "@domain/sections/section";
import {isEmpty} from "lodash";

export type PublishedCatalog = {
    _id: string;
    catalogId: string;
    structure: PublishedCatalogSections[];
    sections: {[sectionId: string]: Section};
    categories: {[categoryId: string]: Category};
    products: {[productId: string]: Product};
    createdAt: string;
    updatedAt: string;
    version: number;
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

export function ValidatePublishedCatalogSections(sections: PublishedCatalogSections): boolean {
    if (!sections.sectionId) return false;
    if (!Array.isArray(sections.categories)) return false;
    return true;
}

export function ValidatePublishedCatalogCategories(categories: PublishedCatalogCategories): boolean {
    if (!categories.categoryId) return false;
    if (!Array.isArray(categories.products)) return false;
    return true;
}

export function ValidatePublishedCatalogProducts(products: PublishedCatalogProducts): boolean {
    if (!products.productId) return false;
    return true;
}

export function ValidatePublishedCatalog(catalog: PublishedCatalog): boolean {
    if (!catalog._id) return false;
    if (!catalog.catalogId) return false;
    if (isEmpty(catalog.structure)) return false;
    if (!Array.isArray(catalog.structure)) return false;
    catalog.structure.forEach(section => {
        if (!ValidatePublishedCatalogSections(section)) return false;
        section.categories.forEach(category => {
            if (!ValidatePublishedCatalogCategories(category)) return false;
            category.products.forEach(product => {
                if (!ValidatePublishedCatalogProducts(product)) return false;
            });
        });
    });
    if (isEmpty(catalog.sections)) return false;
    Object.keys(catalog.sections).forEach(sectionId => {
        if (!ValidateSection(catalog.sections[sectionId])) return false;
    })
    if (isEmpty(catalog.categories)) return false;
    Object.keys(catalog.categories).forEach(categoryId => {
        if (!ValidateCategory(catalog.categories[categoryId])) return false;
    })
    if (isEmpty(catalog.products)) return false;
    Object.keys(catalog.products).forEach(productId => {
        if (!ValidateProduct(catalog.products[productId])) return false;
    })
    if (typeof catalog.createdAt !== "string") return false;
    if (typeof catalog.updatedAt !== "string") return false;
    if (isNaN(catalog.version)) return false;
    return true;
}
