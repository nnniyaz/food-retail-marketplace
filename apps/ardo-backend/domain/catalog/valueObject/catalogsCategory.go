package valueObject

import "github/nnniyaz/ardo/domain/base/uuid"

type CatalogsCategory struct {
	categoryId uuid.UUID
	products   []CatalogsProduct
}

func NewCatalogsCategory() *CatalogsCategory {
	return &CatalogsCategory{
		categoryId: uuid.NewUUID(),
		products:   []CatalogsProduct{},
	}
}

func (c *CatalogsCategory) GetId() uuid.UUID {
	return c.categoryId
}

func (c *CatalogsCategory) GetProducts() []CatalogsProduct {
	return c.products
}

func (c *CatalogsCategory) AddProduct(product CatalogsProduct) {
	c.products = append(c.products, product)
}

func (c *CatalogsCategory) RemoveProduct(productId uuid.UUID) {
	for i, product := range c.products {
		if product.GetId() == productId {
			c.products = append(c.products[:i], c.products[i+1:]...)
			return
		}
	}
}

func (c *CatalogsCategory) UpdateProductsOrder(products []CatalogsProduct) {
	c.products = products
}

func UnmarshalCatalogsCategoryFromDatabase(categoryId uuid.UUID, products []CatalogsProduct) CatalogsCategory {
	return CatalogsCategory{
		categoryId: categoryId,
		products:   products,
	}
}
