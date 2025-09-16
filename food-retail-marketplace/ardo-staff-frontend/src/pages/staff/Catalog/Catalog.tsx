import React, {FC, useEffect, useMemo, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Alert, Button, Card, Modal, Row, Tabs, Typography} from "antd";
import {LoadingOutlined} from "@ant-design/icons";
import {isEmpty} from "lodash";
import {txt} from "@shared/core/i18ngen";
import {useActions} from "@shared/lib/hooks/useActions";
import {relativeFormat} from "@shared/lib/date/relative-format";
import {useTypedSelector} from "@shared/lib/hooks/useTypedSelector";
import {CatalogSection} from "./components/CatalogSection";
import {ModalAddSection} from "./components/ModalAddSection";
import classes from "./Catalog.module.scss";
import {Reorder} from "framer-motion";
import {CatalogsStructure} from "@entities/catalog/catalog";
import {Notify} from "@shared/lib/notification/notification";

const {Title, Paragraph} = Typography;

export const Catalog: FC = () => {
    const navigate = useNavigate();
    const {currentLang} = useTypedSelector(state => state.lang);
    const {
        catalog,
        publishedAt,
        isLoadingGetCatalog,
        isLoadingPublishCatalog,
        isLoadingGetPublishedAt,
        isLoadingEditCatalog
    } = useTypedSelector(state => state.catalog);
    const {sections, isLoadingGetSections} = useTypedSelector(state => state.sections);
    const {categories, isLoadingGetCategories} = useTypedSelector(state => state.categories);
    const {products, isLoadingGetProducts} = useTypedSelector(state => state.products);
    const {
        fetchCatalogs,
        fetchSections,
        fetchCategories,
        fetchProducts,
        getPublishTime,
        publishCatalog,
        editCatalog,
        setCatalog
    } = useActions();

    const [isAddSectionModalVisible, setIsAddSectionModalVisible] = useState(false);
    const [isPublishCatalogModalVisible, setIsPublishCatalogModalVisible] = useState(false);
    const [currentTab, setCurrentTab] = useState("catalog");

    const catalogErrors = useMemo<string[]>(() => {
        const errors: string[] = [];

        if (currentTab === "promo") {
            if (!isEmpty(catalog?.promo)) {
                catalog?.promo.forEach(section => {
                    const foundSection = sections?.find(s => s.id === section.sectionId);
                    if (!foundSection || !foundSection.name[currentLang]) {
                        errors.push(section.sectionId);
                    }
                    section.categories?.forEach(category => {
                        const foundCategory = categories?.find(c => c.id === category.categoryId);
                        if (!foundCategory || !foundCategory.name[currentLang]) {
                            errors.push(category.categoryId);
                        }
                        category.products?.forEach(product => {
                            const foundProduct = products?.find(p => p.id === product.productId);
                            if (!foundProduct || !foundProduct.name[currentLang]) {
                                errors.push(product.productId);
                            }
                        });
                    });
                });
            }
        } else {
            if (!isEmpty(catalog?.structure)) {
                catalog?.structure.forEach(section => {
                    const foundSection = sections?.find(s => s.id === section.sectionId);
                    if (!foundSection || !foundSection.name[currentLang]) {
                        errors.push(section.sectionId);
                    }
                    section.categories?.forEach(category => {
                        const foundCategory = categories?.find(c => c.id === category.categoryId);
                        if (!foundCategory || !foundCategory.name[currentLang]) {
                            errors.push(category.categoryId);
                        }
                        category.products?.forEach(product => {
                            const foundProduct = products?.find(p => p.id === product.productId);
                            if (!foundProduct || !foundProduct.name[currentLang]) {
                                errors.push(product.productId);
                            }
                        });
                    });
                });
            }
        }
        return errors.filter((value, index, self) => self.indexOf(value) === index);
    }, [catalog, sections, categories, products, currentLang, currentTab]);

    const handlePublishCatalog = async () => {
        if (!catalog) return;
        if (catalogErrors.length > 0) {
            Notify.Info({title: txt.please_fix_catalog_errors[currentLang], message: ""});
            return;
        }
        await publishCatalog(catalog.id, {navigate: navigate});
        setIsPublishCatalogModalVisible(false);
    }

    const handleSetCatalogStructure = (newStructure: CatalogsStructure[]) => {
        if (!catalog) return;
        setCatalog({...catalog, structure: newStructure});
    }

    const handleSetCatalogPromo = (newPromo: CatalogsStructure[]) => {
        if (!catalog) return;
        setCatalog({...catalog, promo: newPromo});
    }

    const handleSaveCatalogOrder = async () => {
        if (!catalog) return;
        if (catalogErrors.length > 0) {
            Notify.Info({title: txt.please_fix_catalog_errors[currentLang], message: ""});
            return;
        }
        await editCatalog({
            structure: catalog.structure,
            promo: catalog.promo
        }, catalog.id, {navigate: navigate});
    }

    useEffect(() => {
        const controller = new AbortController();
        fetchCatalogs({offset: 0, limit: 0}, controller, {navigate: navigate});
        return () => controller.abort();
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        fetchSections({offset: 0, limit: 0}, controller, {navigate: navigate});
        return () => controller.abort();
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        fetchCategories({offset: 0, limit: 0}, controller, {navigate: navigate});
        return () => controller.abort();
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        fetchProducts({offset: 0, limit: 0}, controller, {navigate: navigate});
        return () => controller.abort();
    }, []);

    useEffect(() => {
        if (!catalog) return;
        if (!!publishedAt) return;
        const controller = new AbortController();
        getPublishTime(catalog.id, controller, {navigate: navigate});
        return () => controller.abort();
    }, [catalog]);

    return (
        <div className={classes.main}>
            <Card
                title={
                    <Row className={classes.title__row}>
                        <Title level={3} style={{margin: "0", fontWeight: "400"}}>
                            {txt.catalog_order[currentLang]}
                        </Title>
                        <Row className={classes.title__row__group}>
                            <Paragraph
                                style={{
                                    height: "22px",
                                    margin: "0",
                                    marginRight: "10px",
                                    fontWeight: "400"
                                }}
                            >
                                {
                                    isLoadingGetPublishedAt
                                        ?
                                        <LoadingOutlined style={{fontSize: "22px"}}/>
                                        : (
                                            !!publishedAt && (
                                                `${txt.last_time_published[currentLang]}: ${relativeFormat(publishedAt, currentLang)}`
                                            )
                                        )
                                }
                            </Paragraph>
                            <Button
                                style={{
                                    width: "fit-content",
                                    backgroundColor: "#ff6e30",
                                    color: "white",
                                }}
                                onClick={() => setIsPublishCatalogModalVisible(true)}
                            >
                                {txt.publish_catalog[currentLang]}
                            </Button>
                        </Row>
                    </Row>
                }
                bodyStyle={{padding: "20px", borderRadius: "8px"}}
                loading={isLoadingGetCatalog || isLoadingGetSections || isLoadingGetCategories || isLoadingGetProducts}
            >
                <Tabs
                    defaultActiveKey={currentTab}
                    onChange={setCurrentTab}
                    items={
                        [
                            {
                                key: "catalog",
                                label: txt.catalog[currentLang],
                                children: (
                                    isEmpty(catalog?.structure) ? (
                                        <Button
                                            type={"primary"}
                                            style={{width: "fit-content"}}
                                            onClick={() => setIsAddSectionModalVisible(true)}
                                        >
                                            {txt.add_section_to_catalog[currentLang]}
                                        </Button>
                                    ) : (
                                        <div className={classes.catalog__preview}>
                                            <Alert
                                                type={catalogErrors.length > 0 ? "error" : "info"}
                                                message={
                                                    catalogErrors.length > 0
                                                        ? (
                                                            <>
                                                                <p>{`Catalog's error: ${catalogErrors.length}`}</p>
                                                                <p>{'Please, check below, sections, categories and products. Item is deleted or not translated.'}</p>
                                                            </>
                                                        )
                                                        : `Catalog's error: ${catalogErrors.length}`
                                                }
                                            />

                                            <div className={classes.catalog__preview__content}>
                                                <h3>{`${txt.sections[currentLang]}:`}</h3>

                                                <Row style={{display: "flex", gap: "10px"}}>
                                                    <Button
                                                        type={"primary"}
                                                        style={{width: "fit-content"}}
                                                        onClick={() => setIsAddSectionModalVisible(true)}
                                                    >
                                                        {txt.add_section_to_catalog[currentLang]}
                                                    </Button>
                                                    <Button
                                                        type={"primary"}
                                                        style={{width: "fit-content"}}
                                                        onClick={handleSaveCatalogOrder}
                                                        loading={isLoadingEditCatalog}
                                                    >
                                                        {txt.save_catalog[currentLang]}
                                                    </Button>
                                                </Row>

                                                <Reorder.Group
                                                    className={classes.catalog}
                                                    style={{padding: "0"}}
                                                    as={"ol"}
                                                    values={catalog!.structure}
                                                    onReorder={handleSetCatalogStructure}
                                                >
                                                    {catalog?.structure?.map((section, sectionIndex) => (
                                                        <CatalogSection
                                                            key={section.sectionId}
                                                            sectionStructure={section}
                                                            sectionIndex={sectionIndex}
                                                            catalogErrors={catalogErrors}
                                                        />
                                                    ))}
                                                </Reorder.Group>
                                            </div>
                                        </div>
                                    )
                                )
                            },
                            {
                                key: "promo",
                                label: txt.promo[currentLang],
                                children: (
                                    isEmpty(catalog?.promo) ? (
                                        <Button
                                            type={"primary"}
                                            style={{width: "fit-content"}}
                                            onClick={() => setIsAddSectionModalVisible(true)}
                                        >
                                            {txt.add_section_to_promo[currentLang]}
                                        </Button>
                                    ) : (
                                        <div className={classes.catalog__preview}>
                                            <Alert
                                                type={catalogErrors.length > 0 ? "error" : "info"}
                                                message={
                                                    catalogErrors.length > 0
                                                        ? (
                                                            <>
                                                                <p>{`Catalog's error: ${catalogErrors.length}`}</p>
                                                                <p>{'Please, check below, sections, categories and products. Item is deleted or not translated.'}</p>
                                                            </>
                                                        )
                                                        : `Catalog's error: ${catalogErrors.length}`
                                                }
                                            />

                                            <div className={classes.catalog__preview__content}>
                                                <h3>{`${txt.promo_section[currentLang]}:`}</h3>

                                                <Row style={{display: "flex", gap: "10px"}}>
                                                    <Button
                                                        type={"primary"}
                                                        style={{width: "fit-content"}}
                                                        onClick={handleSaveCatalogOrder}
                                                        loading={isLoadingEditCatalog}
                                                    >
                                                        {txt.save_promo[currentLang]}
                                                    </Button>
                                                </Row>

                                                <Reorder.Group
                                                    className={classes.catalog}
                                                    style={{padding: "0"}}
                                                    as={"ol"}
                                                    values={catalog!.promo}
                                                    onReorder={handleSetCatalogPromo}
                                                >
                                                    {catalog?.promo?.map((section, sectionIndex) => (
                                                        <CatalogSection
                                                            key={section.sectionId}
                                                            sectionStructure={section}
                                                            sectionIndex={sectionIndex}
                                                            catalogErrors={catalogErrors}
                                                            isPromo={true}
                                                        />
                                                    ))}
                                                </Reorder.Group>
                                            </div>
                                        </div>
                                    )
                                )
                            }
                        ]
                    }
                />
            </Card>

            <ModalAddSection
                isOpen={isAddSectionModalVisible}
                setIsOpen={setIsAddSectionModalVisible}
                isPromo={currentTab === "promo"}
            />

            <Modal
                title={txt.publish_catalog[currentLang]}
                open={isPublishCatalogModalVisible}
                onOk={handlePublishCatalog}
                confirmLoading={isLoadingPublishCatalog}
                onCancel={() => setIsPublishCatalogModalVisible(false)}
            >
                <Paragraph>{txt.are_you_sure_that_you_want_to_publish_catalog[currentLang]}</Paragraph>
            </Modal>
        </div>
    )
}
