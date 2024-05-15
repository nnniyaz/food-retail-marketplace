import React, {FC, useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {Card, Table} from "antd";
import {ColumnsType} from "antd/es/table";
import {RouteNames} from "@pages/index";
import {Order, OrderProduct} from "@entities/order/order";
import {Currency} from "@entities/base/currency";
import {TableParams} from "@entities/base/tableParams";
import {txt} from "@shared/core/i18ngen";
import {Filters} from "@shared/ui/Filters";
import {useActions} from "@shared/lib/hooks/useActions";
import {dateFormat} from "@shared/lib/date/date-format";
import {TableHeader} from "@shared/ui/TableTools/TableHeader";
import {priceFormat} from "@shared/lib/price/priceFormat";
import {useTypedSelector} from "@shared/lib/hooks/useTypedSelector";
import classes from "@pages/staff/Orders/Orders.module.scss";

export const Orders: FC = () => {
    const navigate = useNavigate();
    const {currentLang} = useTypedSelector(state => state.lang);
    const {orders, ordersCount, isLoadingGetOrders} = useTypedSelector(state => state.orders);
    const {fetchOrders} = useActions();
    const [pagination, setPagination] = useState<TableParams>({
        pagination: {
            current: 1,
            pageSize: 25,
            total: ordersCount
        }
    });
    const [filters, setFilters] = useState({isDeleted: false});

    const columns: ColumnsType<Order> = [
        {
            key: "action",
            title: txt.action[currentLang],
            dataIndex: "action",
            render: (_, record) => (
                <Link to={RouteNames.ORDERS_EDIT.replace(":id", record?.id)}>{txt.details[currentLang]}</Link>
            )
        },
        {
            key: "number",
            title: txt.order_number[currentLang],
            dataIndex: "number",
        },
        {
            key: "status",
            title: txt.status[currentLang],
            dataIndex: "status",
        },
        {
            key: "totalPrice",
            title: txt.total_price[currentLang],
            dataIndex: "totalPrice",
            render: (_, record) => priceFormat(record.totalPrice, record.currency)
        },
        {
            key: "createdAt",
            title: txt.created_at[currentLang],
            dataIndex: "createdAt",
            render: (createdAt: Timestamp) => dateFormat(createdAt)
        },
    ];

    const data: Order[] = orders?.map(order => ({...order, key: order.id})) || [];

    const filterIsDeletedOptions = [
        {label: txt.yes[currentLang], value: true},
        {label: txt.no[currentLang], value: false}
    ];

    const handleSearch = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent> | React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
    }

    const handleOnAddProduct = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent> | React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        navigate(RouteNames.ORDERS_ADD);
    }

    useEffect(() => {
        setPagination({
            pagination: {
                ...pagination.pagination,
                total: ordersCount
            }
        });
    }, [ordersCount]);

    useEffect(() => {
        const controller = new AbortController();
        fetchOrders({
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
                    searchPlaceholder={txt.search_order_by_id_or_order_number[currentLang]}
                    onSearch={handleSearch}
                    onSearchText={txt.search[currentLang]}
                    onSubButtonClick={handleOnAddProduct}
                    onSubButtonText={txt.add_order[currentLang]}
                />
                <Filters
                    filters={[
                        {
                            label: txt.deleted_orders[currentLang],
                            value: filters.isDeleted,
                            onChange: (value) => setFilters({...filters, isDeleted: value}),
                            options: filterIsDeletedOptions,
                            defaultValue: false
                        }
                    ]}
                />
                <Table
                    bordered={true}
                    columns={columns}
                    dataSource={data}
                    loading={isLoadingGetOrders}
                    scroll={{x: 500}}
                    pagination={pagination.pagination}
                    onChange={(pagination) => setPagination({pagination})}
                    expandable={{
                        expandedRowRender: (record) => (
                            <Table
                                style={{margin: "20px 10px 20px 0"}}
                                size={"small"}
                                pagination={false}
                                dataSource={record.products}
                                bordered={true}
                                columns={[
                                    {
                                        key: "productName",
                                        title: txt.name[currentLang],
                                        dataIndex: "productName",
                                        render: (_, subRecord: OrderProduct) => subRecord.productName[currentLang]
                                    },
                                    {
                                        key: "pricePerUnit",
                                        title: txt.price[currentLang],
                                        dataIndex: "pricePerUnit",
                                        render: (_, subRecord: OrderProduct) => priceFormat(subRecord.pricePerUnit, record.currency)
                                    },
                                    {
                                        key: "quantity",
                                        title: txt.quantity[currentLang],
                                        dataIndex: "quantity",
                                    },
                                    {
                                        key: "totalPrice",
                                        dataIndex: "totalPrice",
                                        title: txt.total_price[currentLang],
                                        render: (_, subRecord: OrderProduct) => priceFormat(subRecord.totalPrice, record.currency)
                                    },
                                ]}
                                summary={() => (
                                    <Table.Summary>
                                        <Table.Summary.Row>
                                            <Table.Summary.Cell index={0}></Table.Summary.Cell>
                                            <Table.Summary.Cell index={1}></Table.Summary.Cell>
                                            <Table.Summary.Cell index={2}>
                                                <p style={{color: "#005FF9"}}>
                                                    {txt.total[currentLang].toUpperCase()}
                                                </p>
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell index={3}>
                                                <p style={{color: "#005FF9"}}>
                                                    {priceFormat(record.totalPrice, record.currency)}
                                                </p>
                                            </Table.Summary.Cell>
                                        </Table.Summary.Row>
                                    </Table.Summary>
                                )}
                            />
                        )
                    }}
                />
            </Card>
        </div>
    );
};
