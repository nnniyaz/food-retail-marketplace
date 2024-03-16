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
    categories: CatalogsCategory[],
}

export interface CatalogsCategory {
    categoryId: string,
    products: CatalogsProduct[],
}

export interface CatalogsProduct {
    productId: string,
}

export interface CatalogData {
    catalogs: Catalog[],
    count: number,
}

export interface CatalogPublishTime {
    publishedAt: Timestamp,
}
