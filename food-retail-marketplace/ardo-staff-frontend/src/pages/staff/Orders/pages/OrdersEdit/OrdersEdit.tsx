import {Button, Card, Table, Timeline} from "antd";
import classes from "./OrdersEdit.module.scss";
import React, {useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useTypedSelector} from "@shared/lib/hooks/useTypedSelector";
import {RouteNames} from "@pages/index";
import {useActions} from "@shared/lib/hooks/useActions";
import {txt} from "@shared/core/i18ngen";
import {RowInfo} from "@shared/ui/RowInfo";
import {CountryCodes} from "@entities/base/phone";
import {phoneFormat} from "@shared/lib/phone/phoneFormat";
import {priceFormat} from "@shared/lib/price/priceFormat";
import {Currency} from "@entities/base/currency";
import {dateFormat} from "@shared/lib/date/date-format";
import {sortStatusHistory} from "@shared/lib/status/sortStatusHistory";
import {OrderProduct, OrderStatus} from "@entities/order/order";
import {getLastStatusHistory} from "@shared/lib/status/getLastStatusHistory";
import {back} from "@shared/lib/back/back";

export const OrdersEdit = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const {currentLang} = useTypedSelector(state => state.lang);
    const {
        orderById,
        isLoadingGetOrderById,
        isLoadingEditOrderStatus,
        isLoadingDeleteOrder,
        isLoadingRecoverOrder
    } = useTypedSelector(state => state.orders);
    const {
        getOrderById,
        updateOrderStatus,
        deleteOrder,
        recoverOrder
    } = useActions();

    const statusesWithIndex = {
        [OrderStatus.ORDER_HAS_BEEN_PLACED]: 0,
        [OrderStatus.ORDER_CONFIRMED]: 1,
        [OrderStatus.FINAL_INVOICE_SENT]: 2,
        [OrderStatus.GOODS_DELIVERED]: 3,
        [OrderStatus.PAID]: 4,
    };

    const getKeyByValue = (object: { [key: string]: number }, value: number) => {
        return Object.keys(object).find(key => object[key] === value);
    }

    const handleUpdateOrderStatus = (status: OrderStatus) => {
        if (!id) {
            return;
        }
        updateOrderStatus(id, {status: status}, {navigate});
    }

    const handleCancel = () => {
        back(RouteNames.ORDERS, navigate);
    }

    const handleDelete = () => {
        if (!id) {
            return;
        }
        deleteOrder(id, {navigate});
    }

    const handleRecovers = () => {
        if (!id) {
            return;
        }
        recoverOrder(id, {navigate});
    }

    useEffect(() => {
        if (!id) {
            return;
        }
        const controller = new AbortController();
        getOrderById(id, controller, {navigate});
        return () => controller.abort();
    }, [id]);

    useEffect(() => {
        if (!id) {
            navigate(RouteNames.USERS);
        }
    }, []);

    return (
        <div className={classes.main}>
            <div style={{display: "flex", flexDirection: "column", gap: "20px"}}>
            <Card
                loading={isLoadingGetOrderById}
                className={classes.main__card}
                bodyStyle={{padding: "10px", borderRadius: "8px"}}
            >
                <h1 className={classes.title}>{`#${orderById?.number}` || "-"}</h1>
                <h3 className={classes.subtitle}>{orderById?.id || "-"}</h3>
                <RowInfo
                    label={txt.user_id[currentLang]}
                    value={orderById?.userId || "-"}
                />
                <RowInfo
                    label={txt.client[currentLang]}
                    value={orderById?.customerContacts?.name || "-"}
                />
                <RowInfo
                    label={txt.phone[currentLang]}
                    value={
                        orderById?.customerContacts?.phone
                            ? `${CountryCodes[orderById?.customerContacts?.phone?.countryCode].dialCode} ${phoneFormat(orderById?.customerContacts?.phone?.number, orderById?.customerContacts?.phone?.countryCode)}`
                            : "-"
                    }
                />
                <RowInfo
                    label={txt.email[currentLang]}
                    value={orderById?.customerContacts?.email || "-"}
                />
                <RowInfo
                    label={txt.currency[currentLang]}
                    value={orderById?.currency || "-"}
                />
                <RowInfo
                    label={txt.total_price[currentLang]}
                    value={priceFormat(orderById?.totalPrice || 0, orderById?.currency || Currency.HKD) || "-"}
                />
                <RowInfo
                    label={txt.total_products_quantity[currentLang]}
                    value={orderById?.quantity || "-"}
                />
                <RowInfo
                    label={txt.address[currentLang]}
                    value={orderById?.deliveryInfo?.address || "-"}
                />
                <RowInfo
                    label={txt.floor[currentLang]}
                    value={orderById?.deliveryInfo?.floor || "-"}
                />
                <RowInfo
                    label={txt.apartment[currentLang]}
                    value={orderById?.deliveryInfo?.apartment || "-"}
                />
                <RowInfo
                    label={txt.delivery_comment[currentLang]}
                    value={orderById?.deliveryInfo?.deliveryComment || "-"}
                />
                <RowInfo
                    label={txt.is_deleted[currentLang]}
                    value={orderById?.isDeleted ? txt.yes[currentLang] : txt.no[currentLang]}
                />
                <RowInfo
                    label={txt.created_at[currentLang]}
                    value={dateFormat(orderById?.createdAt || "") || "-"}
                />
                <RowInfo
                    label={txt.user_id[currentLang]}
                    value={dateFormat(orderById?.updatedAt || "") || "-"}
                />
                <RowInfo
                    label={txt.version[currentLang]}
                    value={orderById?.version || "-"}
                />

                <div className={classes.row__btns}>
                    <Button onClick={handleCancel}>
                        {txt.back[currentLang]}
                    </Button>
                    <Button
                        onClick={orderById?.isDeleted ? handleRecovers : handleDelete}
                        loading={isLoadingDeleteOrder || isLoadingRecoverOrder}
                        danger={!orderById?.isDeleted}
                        type={"primary"}
                    >
                        {orderById?.isDeleted ? txt.recover[currentLang] : txt.delete[currentLang]}
                    </Button>
                </div>
            </Card>

            <Card
                loading={isLoadingGetOrderById}
                title={txt.order_products[currentLang]}
                bodyStyle={{padding: "10px", borderRadius: "8px"}}
            >
                <Table
                    style={{margin: "20px 10px 20px 0"}}
                    size={"small"}
                    pagination={false}
                    dataSource={orderById?.products}
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
                            render: (_, subRecord: OrderProduct) => priceFormat(subRecord.pricePerUnit, orderById?.currency || Currency.HKD)
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
                            render: (_, subRecord: OrderProduct) => priceFormat(subRecord.totalPrice, orderById?.currency || Currency.HKD)
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
                                        {priceFormat(orderById?.totalPrice || 0, orderById?.currency || Currency.HKD)}
                                    </p>
                                </Table.Summary.Cell>
                            </Table.Summary.Row>
                        </Table.Summary>
                    )}
                />
            </Card>
            </div>

            <Card
                loading={isLoadingEditOrderStatus}
                title={txt.status[currentLang]}
                className={classes.status__card}
            >
                <h3 className={classes.subtitle} style={{marginBottom: "10px"}}>
                    {`${txt.next_statuses[currentLang]}:`}
                </h3>

                <div style={{display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "40px"}}>
                    {
                        !!getLastStatusHistory(orderById?.statusHistory || []) && (
                            <>
                                {statusesWithIndex[getLastStatusHistory(orderById?.statusHistory || [])!.status] - 1 >= 0 && (
                                    <Button
                                        onClick={() => handleUpdateOrderStatus(getKeyByValue(statusesWithIndex, statusesWithIndex[getLastStatusHistory(orderById?.statusHistory || [])!.status] - 1) as OrderStatus)}>
                                        {getKeyByValue(statusesWithIndex, statusesWithIndex[getLastStatusHistory(orderById?.statusHistory || [])!.status] - 1)}
                                    </Button>
                                )}
                                {statusesWithIndex[getLastStatusHistory(orderById?.statusHistory || [])!.status] + 1 < Object.keys(statusesWithIndex).length && (
                                    <Button
                                        onClick={() => handleUpdateOrderStatus(getKeyByValue(statusesWithIndex, statusesWithIndex[getLastStatusHistory(orderById?.statusHistory || [])!.status] + 1) as OrderStatus)}>
                                        {getKeyByValue(statusesWithIndex, statusesWithIndex[getLastStatusHistory(orderById?.statusHistory || [])!.status] + 1)}
                                    </Button>
                                )}
                            </>
                        )
                    }
                </div>

                <Timeline
                    style={{marginTop: "20px"}}
                    items={
                        sortStatusHistory(orderById?.statusHistory || []).map(
                            (statusHistory, index) => ({
                                key: index,
                                children: (
                                    <div>
                                        <h4>{statusHistory.status}</h4>
                                        <p style={{opacity: "0.5"}}>{dateFormat(statusHistory.updatedAt)}</p>
                                    </div>
                                ),
                            })
                        ).reverse()
                    }
                />
            </Card>
        </div>
    )
}
