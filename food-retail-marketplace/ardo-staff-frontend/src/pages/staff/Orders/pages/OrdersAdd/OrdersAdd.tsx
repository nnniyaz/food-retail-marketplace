import {Button, Card, Checkbox, Collapse, Divider, Form, Input, Select, Table} from "antd";
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {ColumnsType} from "antd/es/table";
import {useForm, useWatch} from "antd/es/form/Form";
import {RouteNames} from "@pages/index";
import {User} from "@entities/user/user";
import {Product} from "@entities/product/product";
import {MlString} from "@entities/base/MlString";
import {Currency} from "@entities/base/currency";
import {TableParams} from "@entities/base/tableParams";
import {OrderProduct} from "@entities/order/order";
import {CountryCodeEnum, Phone} from "@entities/base/phone";
import {txt} from "@shared/core/i18ngen";
import {rules} from "@shared/lib/form-rules/rules";
import {Notify} from "@shared/lib/notification/notification";
import {PhoneInput} from "@shared/ui/Input/PhoneInput";
import {useActions} from "@shared/lib/hooks/useActions";
import {NumberInput} from "@shared/ui/Input/NumberInput";
import {priceFormat} from "@shared/lib/price/priceFormat";
import {currencyOptions} from "@shared/lib/price/currencies";
import {useTypedSelector} from "@shared/lib/hooks/useTypedSelector";
import classes from "./OrdersAdd.module.scss";

const initialFormValues = {
    userId: "",
    products: [] as OrderProduct[],
    quantity: 0,
    totalPrice: 0,
    currency: Currency.HKD,
    name: "",
    phone: {
        number: "",
        countryCode: CountryCodeEnum.HK,
    },
    email: "",
    address: "",
    floor: "",
    apartment: "",
    deliveryComment: "",
}

export const OrdersAdd = () => {
    const navigate = useNavigate();
    const {currentLang} = useTypedSelector(state => state.lang);
    const {isLoadingAddOrder} = useTypedSelector(state => state.orders);
    const {users} = useTypedSelector(state => state.users);
    const {addOrder} = useActions();
    const [form] = useForm();
    const values = useWatch([], form);
    const [selectedUser, setSelectedUser] = useState<UUID | null>(null);
    const [selectedProducts, setSelectedProducts] = useState<OrderProduct[]>([]);

    const handleProductSelect = (product: OrderProduct) => {
        if (selectedProducts.map(item => item.productId).includes(product.productId)) {
            setSelectedProducts(selectedProducts.filter(item => item.productId !== product.productId));
            return;
        }
        setSelectedProducts([...selectedProducts, product]);
    }

    const handleProductQuantityChange = (productId: UUID, quantity: number) => {
        setSelectedProducts(selectedProducts.map(product => {
            if (product.productId === productId) {
                return {
                    ...product,
                    quantity: quantity,
                    totalPrice: product.pricePerUnit * quantity,
                }
            }
            return product;
        }));
    }

    const handleProductPriceChange = (productId: UUID, price: number) => {
        setSelectedProducts(selectedProducts.map(product => {
            if (product.productId === productId) {
                return {
                    ...product,
                    pricePerUnit: price,
                    totalPrice: product.quantity * price,
                }
            }
            return product;
        }));
    }

    const [submittable, setSubmittable] = useState(false);

    const handleCancel = () => {
        navigate(RouteNames.ORDERS);
    }

    const handleSubmit = async () => {
        if (!selectedUser) {
            Notify.Info({title: txt.please_select_client[currentLang], message: ""});
            return;
        }

        let isValid = true;
        selectedProducts.forEach(product => {
            if (product.quantity <= 0) {
                Notify.Info({
                    title: txt.please_enter_quantity[currentLang],
                    message: txt.name[currentLang] + ": " + product.productName[currentLang]
                });
                isValid = false;
                return;
            }

            if (product.pricePerUnit <= 0) {
                Notify.Info({
                    title: txt.please_enter_price[currentLang],
                    message: txt.name[currentLang] + ": " + product.productName[currentLang]
                });
                isValid = false;
                return;
            }
        });
        if (!isValid) return;

        const totalQuantity = selectedProducts.reduce((acc, product) => acc + product.quantity, 0);
        const totalPrice = selectedProducts.reduce((acc, product) => acc + product.totalPrice, 0);

        const values = form.getFieldsValue();
        await addOrder({
            userId: selectedUser,
            products: selectedProducts,
            quantity: totalQuantity,
            totalPrice: totalPrice,
            currency: values.currency,
            customerContacts: {
                name: values.name,
                phone: values.phone,
                email: values.email,
            },
            deliveryInfo: {
                address: values.address,
                floor: values.floor,
                apartment: values.apartment,
                deliveryComment: values.deliveryComment,
            },
        }, {navigate, to: RouteNames.ORDERS});
    }

    useEffect(() => {
        form.validateFields({validateOnly: true}).then(
            () => setSubmittable(!!selectedUser),
            () => setSubmittable(false),
        );
    }, [values]);

    useEffect(() => {
        if (selectedUser) {
            const user = users.find(user => user.id === selectedUser);
            if (!user) return;
            form.setFieldsValue({
                userId: user.id,
                name: user.firstName + " " + user.lastName,
                phone: user.phone,
                email: user.email,
                address: user.lastDeliveryPoint.address,
                floor: user.lastDeliveryPoint.floor,
                apartment: user.lastDeliveryPoint.apartment,
                deliveryComment: user.lastDeliveryPoint.deliveryComment,
            });
        } else {
            form.setFieldsValue({
                userId: "",
                name: "",
                phone: {
                    number: "",
                    countryCode: CountryCodeEnum.HK,
                },
                email: "",
                address: "",
                floor: "",
                apartment: "",
                deliveryComment: "",
            });
        }
    }, [selectedUser]);

    return (
        <div className={classes.main}>
            <Card title={txt.new_order[currentLang]} bodyStyle={{padding: "20px", borderRadius: "8px"}}>
                <Form form={form} layout={"vertical"} onFinish={handleSubmit} initialValues={initialFormValues}>
                    <Collapse
                        items={[{
                            key: "customer",
                            label: `${txt.client[currentLang]}${values?.name ? ` - ${values?.name}` : ""}`,
                            children: (
                                <>
                                    <UsersTable selectedUser={selectedUser} onUserSelect={setSelectedUser}/>

                                    <Divider style={{margin: "10px 0"}}>{txt.client_data[currentLang]}</Divider>

                                    <Form.Item
                                        name={"name"}
                                        label={txt.customer_name[currentLang]}
                                        rules={[
                                            rules.required(txt.please_enter_customer_name[currentLang]),
                                        ]}
                                    >
                                        <Input
                                            placeholder={txt.enter_customer_name[currentLang]}
                                            disabled={!selectedUser}
                                        />
                                    </Form.Item>

                                    <div className={classes.form__row}>
                                        <Form.Item
                                            name={"email"}
                                            label={txt.email[currentLang]}
                                            className={classes.form__item}
                                            rules={[
                                                rules.required(txt.please_enter_email[currentLang]),
                                                rules.email(txt.please_enter_valid_email[currentLang])
                                            ]}
                                        >
                                            <Input
                                                placeholder={txt.enter_email[currentLang]}
                                                disabled={!selectedUser}
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            name={"phone"}
                                            label={txt.phone[currentLang]}
                                            className={classes.form__item}
                                            rules={[
                                                rules.required(txt.please_enter_phone[currentLang]),
                                                rules.phone(form, currentLang)
                                            ]}
                                        >
                                            <PhoneInput
                                                value={form.getFieldValue("phone")}
                                                onChange={(value: Phone) => form.setFieldValue("phone", value)}
                                                disabled={!selectedUser}
                                            />
                                        </Form.Item>
                                    </div>

                                    <div className={classes.form__row}>
                                        <Form.Item
                                            name={"address"}
                                            label={txt.address[currentLang]}
                                            className={classes.form__item}
                                            rules={[
                                                rules.required(txt.please_enter_address[currentLang]),
                                            ]}
                                        >
                                            <Input
                                                placeholder={txt.enter_address[currentLang]}
                                                disabled={!selectedUser}
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            name={"floor"}
                                            label={txt.floor[currentLang]}
                                            className={classes.form__item}
                                            rules={[
                                                rules.required(txt.please_enter_floor[currentLang]),
                                            ]}
                                        >
                                            <Input
                                                placeholder={txt.enter_floor[currentLang]}
                                                disabled={!selectedUser}
                                            />
                                        </Form.Item>
                                    </div>

                                    <div className={classes.form__row}>
                                        <Form.Item
                                            name={"apartment"}
                                            label={txt.apartment[currentLang]}
                                            className={classes.form__item}
                                            rules={[
                                                rules.required(txt.please_enter_apartment[currentLang]),
                                            ]}
                                        >
                                            <Input
                                                placeholder={txt.enter_apartment[currentLang]}
                                                disabled={!selectedUser}
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            name={"deliveryComment"}
                                            label={txt.delivery_comment[currentLang]}
                                            className={classes.form__item}
                                        >
                                            <Input
                                                placeholder={txt.enter_delivery_comment[currentLang]}
                                                disabled={!selectedUser}
                                            />
                                        </Form.Item>
                                    </div>

                                    <Form.Item
                                        name={"currency"}
                                        label={txt.currency[currentLang]}
                                        rules={[
                                            rules.required(txt.please_select_currency[currentLang]),
                                        ]}
                                    >
                                        <Select
                                            placeholder={txt.select_currency[currentLang]}
                                            options={currencyOptions}
                                            disabled={true}
                                        />
                                    </Form.Item>
                                </>
                            )
                        }]}
                        style={{marginBottom: "20px"}}
                    />

                    <Collapse
                        items={[
                            {
                                key: "products",
                                label: txt.products[currentLang],
                                collapsible: !selectedUser ? "disabled" : undefined,
                                children: (
                                    <>
                                        <ProductsTable
                                            selectedProducts={selectedProducts}
                                            currency={values?.currency || CountryCodeEnum.HK}
                                            onProductSelect={handleProductSelect}
                                            onProductQuantityChange={handleProductQuantityChange}
                                            onProductPriceChange={handleProductPriceChange}
                                        />
                                    </>
                                )
                            }
                        ]}
                    />

                    <Form.Item style={{margin: "0"}}>
                        <div className={classes.form__btns}>
                            <Button
                                onClick={handleCancel}
                                type={"primary"}
                                style={{margin: "0"}}
                            >
                                {txt.back[currentLang]}
                            </Button>
                            <Button
                                loading={isLoadingAddOrder}
                                disabled={isLoadingAddOrder || !submittable || !selectedUser}
                                type={"primary"}
                                htmlType={"submit"}
                                style={{margin: "0"}}
                                className={classes.btn}
                            >
                                {txt.add[currentLang]}
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    )
}

interface UsersTableProps {
    selectedUser: UUID | null;
    onUserSelect: (userId: UUID | null) => void;
}

const UsersTable = ({selectedUser, onUserSelect}: UsersTableProps) => {
    const navigate = useNavigate();
    const {currentLang} = useTypedSelector(state => state.lang);
    const {users, usersCount, isLoadingGetUsers} = useTypedSelector(state => state.users);
    const {fetchUsers} = useActions();
    const [pagination, setPagination] = useState<TableParams>({
        pagination: {
            current: 1,
            pageSize: 5,
            total: usersCount
        }
    });

    const columns: ColumnsType<User> = [
        {
            key: "action",
            title: txt.action[currentLang],
            dataIndex: "id",
            render: (id: string) => (
                <Checkbox
                    checked={selectedUser === id}
                    onChange={() => {
                        if (selectedUser === id) onUserSelect(null);
                        else onUserSelect(id)
                    }}
                />
            ),
            width: "50px"
        },
        {
            key: "code",
            title: txt.code[currentLang],
            dataIndex: "code"
        },
        {
            key: "firstName",
            title: txt.first_name[currentLang],
            dataIndex: "firstName"
        },
        {
            key: "lastName",
            title: txt.last_name[currentLang],
            dataIndex: "lastName"
        },
    ];

    const data: User[] = users?.map(user => ({...user, key: user.id})) || [];

    useEffect(() => {
        setPagination({
            pagination: {
                ...pagination.pagination,
                total: usersCount
            }
        });
    }, [usersCount]);

    useEffect(() => {
        const controller = new AbortController();
        fetchUsers({
            limit: pagination.pagination?.pageSize || 5,
            offset: (pagination.pagination?.current! - 1) * pagination.pagination?.pageSize!,
            is_deleted: false
        }, controller, {navigate: navigate});
        return () => controller.abort();
    }, [pagination.pagination?.current, pagination.pagination?.pageSize]);

    return (
        <Table
            columns={columns}
            dataSource={data}
            loading={isLoadingGetUsers}
            pagination={pagination.pagination}
            onChange={(pagination) => setPagination({pagination})}
            title={() => txt.please_select_client[currentLang]}
            scroll={{x: 500}}
            bordered={true}
            size={"small"}
        />
    )
}

interface ProductsTableProps {
    selectedProducts: OrderProduct[];
    currency: Currency;
    onProductSelect: (product: OrderProduct) => void;
    onProductQuantityChange: (productId: UUID, quantity: number) => void;
    onProductPriceChange: (productId: UUID, price: number) => void;
}

const ProductsTable = (
    {selectedProducts, currency, onProductSelect, onProductQuantityChange, onProductPriceChange}: ProductsTableProps
) => {
    const navigate = useNavigate();
    const {currentLang} = useTypedSelector(state => state.lang);
    const {products, productsCount, isLoadingGetProducts} = useTypedSelector(state => state.products);
    const {fetchProducts} = useActions();
    const [pagination, setPagination] = useState<TableParams>({
        pagination: {
            current: 1,
            pageSize: 5,
            total: productsCount
        }
    });

    const columnsSource: ColumnsType<Product> = [
        {
            key: "action",
            title: txt.action[currentLang],
            dataIndex: "action",
            render: (_, record) => (
                <Checkbox
                    checked={selectedProducts.map(item => item.productId).includes(record.id)}
                    onChange={() => onProductSelect({
                        productId: record.id,
                        productName: record.name,
                        quantity: 1,
                        pricePerUnit: record.price,
                        totalPrice: record.price,
                    })}
                />
            ),
            width: "50px"
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
            key: "price",
            title: txt.price[currentLang],
            dataIndex: "price",
            render: (price) => priceFormat(price, Currency.HKD)
        },
    ];

    const dataSource: Product[] = products?.map(product => ({...product, key: product.id})) || [];

    const columnsTarget: ColumnsType<OrderProduct> = [
        {
            key: "action",
            title: txt.action[currentLang],
            dataIndex: "action",
            render: (_, record) => (
                <Checkbox
                    checked={selectedProducts.map(item => item.productId).includes(record.productId)}
                    onChange={() => onProductSelect({
                        productId: record.productId,
                        productName: record.productName,
                        quantity: 1,
                        pricePerUnit: record.pricePerUnit,
                        totalPrice: record.totalPrice,
                    })}
                />
            ),
            width: "50px"
        },
        {
            key: "target-productId",
            title: txt.id[currentLang],
            dataIndex: "productId"
        },
        {
            key: "target-productName",
            title: txt.name[currentLang],
            dataIndex: "productName",
            render: (name: MlString) => name[currentLang]
        },
        {
            key: "target-quantity",
            title: txt.quantity[currentLang],
            dataIndex: "quantity",
            render: (quantity, record) => {
                return (
                    <NumberInput
                        value={quantity}
                        onChange={(value) => onProductQuantityChange(record.productId, value)}
                    />
                )
            },
        },
        {
            key: "target-pricePerUnit",
            title: txt.price[currentLang],
            dataIndex: "pricePerUnit",
            render: (pricePerUnit, record) => (
                <NumberInput
                    value={pricePerUnit}
                    onChange={(value) => onProductPriceChange(record.productId, value)}
                />
            ),
        },
        {
            key: "target-price",
            title: txt.total_price[currentLang],
            dataIndex: "totalPrice",
            render: (totalPrice) => priceFormat(totalPrice, currency)
        },
    ];

    const dataTarget: OrderProduct[] = selectedProducts.map(product => ({...product, key: `target-${product.productId}`}));

    useEffect(() => {
        setPagination({...pagination, pagination: {...pagination.pagination, total: productsCount}});
    }, [productsCount]);

    useEffect(() => {
        const controller = new AbortController();
        fetchProducts({
            limit: pagination.pagination?.pageSize || 5,
            offset: (pagination.pagination?.current! - 1) * pagination.pagination?.pageSize!,
            is_deleted: false
        }, controller, {navigate: navigate});
        return () => controller.abort();
    }, [pagination.pagination?.current, pagination.pagination?.pageSize]);

    return (
        <>
            <Table
                bordered={true}
                title={() => txt.please_select_products[currentLang]}
                columns={columnsSource}
                dataSource={dataSource}
                loading={isLoadingGetProducts}
                pagination={pagination.pagination}
                onChange={(pagination) => setPagination({pagination})}
                scroll={{x: 500}}
            />
            <Divider plain>
                <p style={{whiteSpace: "pre-wrap"}}>
                    {txt.select_from_top_table_to_the_bottom_table[currentLang]}
                </p>
            </Divider>
            <Table
                bordered={true}
                title={() => txt.selected_products[currentLang]}
                columns={columnsTarget}
                dataSource={dataTarget}
                scroll={{x: 500}}
                pagination={false}
            />
        </>
    )
}
