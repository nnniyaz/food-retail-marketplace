import {CSSProperties, FunctionComponent} from "react";
import * as ReactNotificationsImport from "react-notifications-component";
const {Store} = ReactNotificationsImport;
import SuccessIcon from "./success.svg?react";
import CrossIcon from "./cross-circle.svg?react";

type NotificationInsertion = 'top' | 'bottom';
type NotificationContainer =
    'bottom-left' |
    'bottom-right' |
    'bottom-center' |
    'top-left' |
    'top-right' |
    'top-center' |
    'center' |
    'top-full' |
    'bottom-full';

const notificationConfig = {
    insert: "top" as NotificationInsertion,
    container: "top-center" as NotificationContainer,
    animationIn: ["animate__animated", "animate__fadeIn"],
    animationOut: ["animate__animated", "animate__fadeOut"],
    dismiss: {duration: 300000, waitForAnimation: true},
}

export interface Notification {
    message: string
    icon?: React.ReactNode
}

export class Notify {
    public static Default = ({message}: Notification) => {
        Store.addNotification({
            ...notificationConfig,
            content: <NotificationComponent message={message}/>
        });
    };

    public static Info = ({message}: Notification) => {
        Store.addNotification({...notificationConfig, content: <NotificationComponent message={message}/>});
    };

    public static Success = ({message}: Notification) => {
        Store.addNotification({
            ...notificationConfig,
            content: <NotificationComponent message={message} icon={<SuccessIcon/>}/>
        });
    };

    public static Warning = ({message}: Notification) => {
        Store.addNotification({...notificationConfig, content: <NotificationComponent message={message}/>});
    };

    public static Error = ({message}: Notification) => {
        Store.addNotification({
            ...notificationConfig,
            content: <NotificationComponent message={message} icon={<CrossIcon/>}/>
        });
    };
}

const NotificationComponentStyles: { [key: string]: CSSProperties } = {
    notification: {
        width: "100%",
        padding: "10px 16px",
        borderRadius: "16px",
        backgroundColor: "#F3F4F6",
        boxShadow: "1px 1px 2px 1px rgba(19, 24, 70, 0.10), 1px 12px 16px 1px rgba(19, 24, 70, 0.12)",
        display: "flex",
        alignItems: "center",
        gap: "16px"
    },
    notification__icon: {},
    notification__text: {
        fontSize: "16px",
        fontWeight: "400",
        lineHeight: "normal",
        color: "#000",
        backgroundColor: "transparent",
        textTransform: "capitalize"
    }
}

export const NotificationComponent: FunctionComponent<Notification> = (props) => {
    return (
        <div style={NotificationComponentStyles.notification}>
            {props.icon}
            <div style={NotificationComponentStyles.notification__text}>
                {props.message[0].toUpperCase() + props.message.slice(1).toLowerCase()}
            </div>
        </div>
)
}
