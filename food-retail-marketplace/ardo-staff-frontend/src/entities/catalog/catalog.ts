export interface Catalog {
    id: string,
    structure: CatalogsStructure[],
    promo: CatalogsStructure[],
    createdAt: Timestamp,
    updatedAt: Timestamp,
    version: number,
}

export interface CatalogsStructure {
    sectionId: string,
    categories: {
        categoryId: string,
        products: {
            productId: string,
        }[],
    }[],
}

export interface CatalogData {
    catalogs: Catalog[],
    count: number,
}

export interface CatalogPublishTime {
    publishedAt: Timestamp,
}
