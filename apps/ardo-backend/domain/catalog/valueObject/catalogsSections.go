package valueObject

import "github/nnniyaz/ardo/domain/base/uuid"

type CatalogsSection struct {
	sectionId  uuid.UUID
	categories []CatalogsCategory
}

func NewCatalogsSection() *CatalogsSection {
	return &CatalogsSection{
		sectionId:  uuid.NewUUID(),
		categories: []CatalogsCategory{},
	}
}

func (s *CatalogsSection) GetId() uuid.UUID {
	return s.sectionId
}

func (s *CatalogsSection) GetCategories() []CatalogsCategory {
	return s.categories
}

func (s *CatalogsSection) AddCategory(category CatalogsCategory) {
	s.categories = append(s.categories, category)
}

func (s *CatalogsSection) RemoveCategory(categoryId uuid.UUID) {
	for i, category := range s.categories {
		if category.GetId() == categoryId {
			s.categories = append(s.categories[:i], s.categories[i+1:]...)
			return
		}
	}
}

func (s *CatalogsSection) UpdateCategoriesOrder(categories []CatalogsCategory) {
	s.categories = categories
}

func UnmarshalCatalogsSectionFromDatabase(sectionId uuid.UUID, categories []CatalogsCategory) CatalogsSection {
	return CatalogsSection{
		sectionId:  sectionId,
		categories: categories,
	}
}
