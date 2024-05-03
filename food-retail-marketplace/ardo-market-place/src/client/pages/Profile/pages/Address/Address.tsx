import React, {useState} from "react";
import {Dropdown, Skeleton, MenuProps, Button, Drawer, Form, Input} from "antd";
import {ReturnButton} from "@widgets/ReturnButton";
import {RouteNames} from "@pages/index.tsx";
import {translate} from "@pkg/translate/translate.ts";
import {useActions} from "@pkg/hooks/useActions.ts";
import {useTypedSelector} from "@pkg/hooks/useTypedSelector.ts";
import {DeliveryPoint} from "@domain/user/user.ts";
import {rules} from "@pkg/form-rules/rules.ts";
import classes from "./Address.module.scss";

export const Address = () => {
    const {currentLang, langs} = useTypedSelector(state => state.systemState);
    const {user, isLoadingDeliveryPoint} = useTypedSelector(state => state.userState);
    const {addDeliveryPoint} = useActions();
    const [form] = Form.useForm();
    const [addMode, setAddMode] = useState(false);

    const handleAddDeliveryPoint = () => {
        addDeliveryPoint(
            form.getFieldValue("address"),
            form.getFieldValue("floor"),
            form.getFieldValue("apartment"),
            form.getFieldValue("deliveryComment")
        );
        setAddMode(false);
    }

    const handleCancelAddDeliveryPoint = () => {
        setAddMode(false);
        form.resetFields();
    }

    return (
        <React.Fragment>
            <ReturnButton
                to={RouteNames.PROFILE}
                title={translate("delivery_addresses", currentLang, langs)}
            />

            <Button
                onClick={() => setAddMode(true)}
                type={"primary"}
                size={"large"}
            >
                <span style={{color: "white"}}>
                    {translate("add_delivery_point", currentLang, langs)}
                </span>
            </Button>

            {
                isLoadingDeliveryPoint
                    ?
                    <ul className={classes.user_delivery_points_list}>
                        {
                            Array(3).fill(0).map(() => (
                                <li className={classes.delivery_point}>
                                    <Skeleton style={{width: "100%", height: "100%"}}/>
                                </li>
                            ))
                        }
                    </ul>
                    :
                    <ul className={classes.user_delivery_points_list}>
                        {
                            !user.deliveryPoints?.length
                                ?
                                <li style={{
                                    height: "200px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    textAlign: "center",
                                    listStyle: "none"
                                }}>
                                    <h2>{translate("no_delivery_points", currentLang, langs)}</h2>
                                </li>
                                :
                                <>
                                    <DeliveryPointComponent
                                        deliveryPoint={user.lastDeliveryPoint}
                                        active={true}
                                    />
                                    {
                                        user.deliveryPoints.filter(
                                            (deliveryPoint) => deliveryPoint.id !== user.lastDeliveryPoint.id
                                        ).map((deliveryPoint) => (
                                            <DeliveryPointComponent
                                                key={deliveryPoint.id}
                                                deliveryPoint={deliveryPoint}
                                            />
                                        ))
                                    }
                                </>
                        }
                    </ul>
            }

            <Drawer
                open={addMode}
                onClose={() => setAddMode(false)}
                title={translate("delivery_point_add", currentLang, langs)}
            >
                <Form
                    layout={"vertical"}
                    onFinish={handleAddDeliveryPoint}
                    form={form}
                >
                    <Form.Item
                        name={"address"}
                        label={translate("address", currentLang, langs)}
                        required={true}
                        rules={[rules.required(translate("please_enter_address", currentLang, langs))]}
                    >
                        <Input placeholder={translate("enter_address", currentLang, langs)}/>
                    </Form.Item>
                    <Form.Item
                        name={"floor"}
                        label={translate("floor", currentLang, langs)}
                        required={true}
                        rules={[rules.required(translate("please_enter_floor", currentLang, langs))]}
                    >
                        <Input placeholder={translate("enter_floor", currentLang, langs)}/>
                    </Form.Item>
                    <Form.Item
                        name={"apartment"}
                        label={translate("apartment", currentLang, langs)}
                        required={true}
                        rules={[rules.required(translate("please_enter_apartment", currentLang, langs))]}
                    >
                        <Input placeholder={translate("enter_apartment", currentLang, langs)}/>
                    </Form.Item>
                    <Form.Item
                        name={"deliveryComment"}
                        label={translate("delivery_instruction", currentLang, langs)}
                    >
                        <Input placeholder={translate("enter_delivery_instruction", currentLang, langs)}/>
                    </Form.Item>
                    <Form.Item>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "flex-end",
                                gap: "10px"
                            }}
                        >
                            <Button type={"primary"} htmlType={"submit"}>
                                <span style={{color: "white"}}>{translate("save", currentLang, langs)}</span>
                            </Button>
                            <Button onClick={handleCancelAddDeliveryPoint}>
                                {translate("cancel", currentLang, langs)}
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </Drawer>
        </React.Fragment>
    )
}

interface DeliveryPointProps {
    deliveryPoint: DeliveryPoint;
    active?: boolean;
}

const DeliveryPointComponent = ({deliveryPoint, active}: DeliveryPointProps) => {
    const {currentLang, langs} = useTypedSelector(state => state.systemState);
    const {
        changeLastDeliveryPoint,
        deleteDeliveryPoint,
        updateDeliveryPoint,
    } = useActions();

    const [editMode, setEditMode] = useState(false);
    const [form] = Form.useForm();

    const handleTurnOnEditMode = () => {
        setEditMode(true);
    }

    const handleUpdateDeliveryPoint = () => {
        updateDeliveryPoint(
            deliveryPoint.id,
            form.getFieldValue("address"),
            form.getFieldValue("floor"),
            form.getFieldValue("apartment"),
            form.getFieldValue("deliveryComment")
        );
        setEditMode(false);
    }

    const handleCancelUpdateDeliveryPoint = () => {
        setEditMode(false);
        form.resetFields();
    }

    const handleDeleteDeliveryPoint = (id: string) => {
        deleteDeliveryPoint(id);
    }

    const handleMakeCurrentDeliveryPoint = (id: string) => {
        changeLastDeliveryPoint(id);
    }

    const options: MenuProps['items'] = active ? [
        {
            key: '1',
            label: translate("make_current_delivery_point", currentLang, langs),
            onClick: () => handleMakeCurrentDeliveryPoint(deliveryPoint.id)
        },
        {
            key: '2',
            label: translate("edit", currentLang, langs),
            onClick: () => handleTurnOnEditMode()
        },
    ] : [
        {
            key: '1',
            label: translate("make_current_delivery_point", currentLang, langs),
            onClick: () => handleMakeCurrentDeliveryPoint(deliveryPoint.id)
        },
        {
            key: '2',
            label: translate("edit", currentLang, langs),
            onClick: () => handleTurnOnEditMode()
        },
        {
            key: '3',
            label: translate("delete", currentLang, langs),
            danger: true,
            onClick: () => handleDeleteDeliveryPoint(deliveryPoint.id)
        },
    ];

    return (
        <>
            <li className={active ? classes.delivery_point__active : classes.delivery_point}>
                <Dropdown menu={{items: options}} placement={"bottomRight"} disabled={editMode}>
                    <a
                        onClick={(e) => e.preventDefault()}
                        style={{
                            position: "absolute",
                            top: "10px",
                            right: "10px"
                        }}
                    >
                        <CircledDots/>
                    </a>
                </Dropdown>
                {
                    active && (
                        <div className={classes.delivery_point__row}>
                            <p className={classes.delivery_point__row__label__active}>
                                {translate("current_delivery_point", currentLang, langs)}
                            </p>
                        </div>
                    )
                }
                <div className={classes.delivery_point__row}>
                    <p className={classes.delivery_point__row__label}>
                        {translate("address", currentLang, langs)}
                    </p>
                    <p className={classes.delivery_point__row__value}>
                        {deliveryPoint.address || "-"}
                    </p>

                </div>
                <div className={classes.delivery_point__row}>
                    <p className={classes.delivery_point__row__label}>
                        {translate("floor", currentLang, langs)}
                    </p>
                    <p className={classes.delivery_point__row__value}>
                        {deliveryPoint.floor || "-"}
                    </p>

                </div>
                <div className={classes.delivery_point__row}>
                    <p className={classes.delivery_point__row__label}>
                        {translate("apartment", currentLang, langs)}
                    </p>

                    <p className={classes.delivery_point__row__value}>
                        {deliveryPoint.apartment || "-"}
                    </p>

                </div>
                <div className={classes.delivery_point__row}>
                    <p className={classes.delivery_point__row__label}>
                        {translate("delivery_instruction", currentLang, langs)}
                    </p>
                    <p className={classes.delivery_point__row__value}>
                        {deliveryPoint.deliveryComment || "-"}
                    </p>
                </div>
            </li>

            <Drawer
                open={editMode}
                onClose={() => setEditMode(false)}
                title={translate("delivery_point_edit", currentLang, langs)}
            >
                <Form
                    layout={"vertical"}
                    onFinish={handleUpdateDeliveryPoint}
                    form={form}
                    initialValues={{
                        address: deliveryPoint.address,
                        floor: deliveryPoint.floor,
                        apartment: deliveryPoint.apartment,
                        deliveryComment: deliveryPoint.deliveryComment
                    }}
                >
                    <Form.Item
                        name={"address"}
                        label={translate("address", currentLang, langs)}
                        required={true}
                        rules={[rules.required(translate("please_enter_address", currentLang, langs))]}
                    >
                        <Input placeholder={translate("enter_address", currentLang, langs)}/>
                    </Form.Item>
                    <Form.Item
                        name={"floor"}
                        label={translate("floor", currentLang, langs)}
                        required={true}
                        rules={[rules.required(translate("please_enter_floor", currentLang, langs))]}
                    >
                        <Input placeholder={translate("enter_floor", currentLang, langs)}/>
                    </Form.Item>
                    <Form.Item
                        name={"apartment"}
                        label={translate("apartment", currentLang, langs)}
                        required={true}
                        rules={[rules.required(translate("please_enter_apartment", currentLang, langs))]}
                    >
                        <Input placeholder={translate("enter_apartment", currentLang, langs)}/>
                    </Form.Item>
                    <Form.Item
                        name={"deliveryComment"}
                        label={translate("delivery_instruction", currentLang, langs)}
                    >
                        <Input placeholder={translate("enter_delivery_instruction", currentLang, langs)}/>
                    </Form.Item>
                    <Form.Item>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "flex-end",
                                gap: "10px"
                            }}
                        >
                            <Button type={"primary"} htmlType={"submit"}>
                                <span style={{color: "white"}}>{translate("save", currentLang, langs)}</span>
                            </Button>
                            <Button onClick={handleCancelUpdateDeliveryPoint}>
                                {translate("cancel", currentLang, langs)}
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </Drawer>
        </>
    )
}

interface CircledDotsProps {
    style?: React.CSSProperties;
}

const CircledDots = ({style}: CircledDotsProps) => (
    <div className={classes.circled_dots} style={style}>
        <div className={classes.circled_dot}/>
        <div className={classes.circled_dot}/>
        <div className={classes.circled_dot}/>
    </div>
)
