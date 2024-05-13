import React, {FC, useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {Card, Table} from "antd";
import {ColumnsType} from "antd/es/table";
import {Product, ProductStatus} from "@entities/product/product";
import {TableParams} from "@entities/base/tableParams";
import {txt} from "@shared/core/i18ngen";
import {Filters} from "@shared/ui/Filters";
import {TableHeader} from "@shared/ui/TableTools/TableHeader";
import {useTypedSelector} from "@shared/lib/hooks/useTypedSelector";
import {RouteNames} from "@pages//";
import classes from "./Products.module.scss";
import {useActions} from "@shared/lib/hooks/useActions";
import {dateFormat} from "@shared/lib/date/date-format";
import {MlString} from "@entities/base/MlString";
import {productStatusTranslate} from "@shared/lib/options/productStatusOptions";

export const Products: FC = () => {
    const navigate = useNavigate();
    const {currentLang} = useTypedSelector(state => state.lang);
    const {products, productsCount, isLoadingGetProducts} = useTypedSelector(state => state.products);
    const {fetchProducts} = useActions();
    const [pagination, setPagination] = useState<TableParams>({
        pagination: {
            current: 1,
            pageSize: 25,
            total: productsCount
        }
    });
    const [filters, setFilters] = useState({isDeleted: false});

    const columns: ColumnsType<Product> = [
        {
            key: "action",
            title: txt.action[currentLang],
            dataIndex: "action",
            render: (_, record) => (
                <Link to={RouteNames.PRODUCTS_EDIT.replace(":id", record?.id)}>{txt.details[currentLang]}</Link>
            )
        },
        {
            key: "id",
            title: txt.id[currentLang],
            dataIndex: "id"
        },
        {
            key: "name",
            title: txt.name[currentLang],
            dataIndex: "name",
            render: (name: MlString) => name[currentLang]
        },
        {
            key: "quantity",
            title: txt.quantity[currentLang],
            dataIndex: "quantity"
        },
        {
            key: "status",
            title: txt.status[currentLang],
            dataIndex: "status",
            render: (status: ProductStatus) => productStatusTranslate(status, currentLang)
        },
        {
            key: "price",
            title: txt.price[currentLang],
            dataIndex: "price"
        },
        {
            key: "createdAt",
            title: txt.created_at[currentLang],
            dataIndex: "createdAt",
            render: (createdAt: Timestamp) => dateFormat(createdAt)
        },
        {
            key: "updatedAt",
            title: txt.updated_at[currentLang],
            dataIndex: "updatedAt",
            render: (updatedAt: Timestamp) => dateFormat(updatedAt)
        },
    ];

    const data: Product[] = products?.map(product => ({...product, key: product.id})) || [];

    const filterIsDeletedOptions = [
        {label: txt.yes[currentLang], value: true},
        {label: txt.no[currentLang], value: false}
    ];

    const handleSearch = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent> | React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
    }

    const handleOnAddProduct = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent> | React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        navigate(RouteNames.PRODUCTS_ADD);
    }

    useEffect(() => {
        setPagination({...pagination, pagination: {...pagination.pagination, total: productsCount}});
    }, [productsCount]);

    useEffect(() => {
        const controller = new AbortController();
        fetchProducts({
            limit: pagination.pagination?.pageSize || 25,
            offset: (pagination.pagination?.current! - 1) * pagination.pagination?.pageSize!,
            is_deleted: filters.isDeleted
        }, controller, {navigate: navigate});
        return () => controller.abort();
    }, [pagination.pagination?.current, pagination.pagination?.pageSize, filters.isDeleted]);

    return (
        <div className={classes.main}>
            <Card bodyStyle={{padding: "20px 10px 10px 10px", borderRadius: "8px"}}>
                <TableHeader
                    searchPlaceholder={txt.search_product_by_id_or_name[currentLang]}
                    onSearch={handleSearch}
                    onSearchText={txt.search[currentLang]}
                    onSubButtonClick={handleOnAddProduct}
                    onSubButtonText={txt.add_product[currentLang]}
                />
                <Filters
                    filters={[
                        {
                            label: txt.deleted_products[currentLang],
                            value: filters.isDeleted,
                            onChange: (value) => setFilters({...filters, isDeleted: value}),
                            options: filterIsDeletedOptions,
                            defaultValue: false
                        }
                    ]}
                />
                <Table
                    columns={columns}
                    dataSource={data}
                    loading={isLoadingGetProducts}
                    scroll={{x: 500}}
                    pagination={pagination.pagination}
                    onChange={(pagination) => setPagination({pagination})}
                />
            </Card>
        </div>
    );
};
