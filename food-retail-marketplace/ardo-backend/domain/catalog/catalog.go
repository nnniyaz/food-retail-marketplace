package catalog

import (
	"github/nnniyaz/ardo/domain/base/uuid"
	"github/nnniyaz/ardo/domain/catalog/valueObject"
	"time"
)

type Catalog struct {
	id        uuid.UUID
	structure []valueObject.CatalogsSection
	promo     []valueObject.CatalogsSection
	createdAt time.Time
	updatedAt time.Time
	version   int
}

func NewCatalog() *Catalog {
	return &Catalog{
		id:        uuid.NewUUID(),
		structure: []valueObject.CatalogsSection{},
		promo:     []valueObject.CatalogsSection{},
		createdAt: time.Now(),
		updatedAt: time.Now(),
		version:   1,
	}
}

func (c *Catalog) GetId() uuid.UUID {
	return c.id
}

func (c *Catalog) GetStructure() []valueObject.CatalogsSection {
	return c.structure
}

func (c *Catalog) GetPromo() []valueObject.CatalogsSection {
	return c.promo
}

func (c *Catalog) GetCreatedAt() time.Time {
	return c.createdAt
}

func (c *Catalog) GetUpdatedAt() time.Time {
	return c.updatedAt
}

func (c *Catalog) GetVersion() int {
	return c.version
}

func (c *Catalog) UpdateCatalog(structure []valueObject.CatalogsSection, promo []valueObject.CatalogsSection) {
	c.structure = structure
	c.promo = promo
	c.updatedAt = time.Now()
	c.version++
}

func UnmarshalCatalogFromDatabase(id uuid.UUID, structure []valueObject.CatalogsSection, promo []valueObject.CatalogsSection, createdAt, updatedAt time.Time, version int) *Catalog {
	return &Catalog{
		id:        id,
		structure: structure,
		promo:     promo,
		createdAt: createdAt,
		updatedAt: updatedAt,
		version:   version,
	}
}
