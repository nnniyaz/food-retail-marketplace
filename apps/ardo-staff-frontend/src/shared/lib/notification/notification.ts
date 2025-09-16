import {Store} from "react-notifications-component";

type NotificationInsertion = 'top' | 'bottom';
type NotificationContainer = 'bottom-left' | 'bottom-right' | 'bottom-center' | 'top-left' | 'top-right' | 'top-center' | 'center' | 'top-full' | 'bottom-full';

const notificationConfig = {
    insert: "top" as NotificationInsertion,
    container: "top-right" as NotificationContainer,
    animationIn: ["animate__animated", "animate__fadeIn"],
    animationOut: ["animate__animated", "animate__fadeOut"],
    dismiss: {duration: 5000, pauseOnHover: true, onScreen: true}
}

export interface Notification {
    title: string;
    message: string;
}

export class Notify {
    public static Default = ({title, message} : Notification) => {
        Store.addNotification({...notificationConfig, title: title, message: message, type: "default"});
    };

    public static Info = ({title, message} : Notification) => {
        Store.addNotification({...notificationConfig, title: title, message: message, type: "info"});
    };

    public static Success = ({title, message} : Notification) => {
        Store.addNotification({...notificationConfig, title: title, message: message, type: "success"});
    };

    public static Warning = ({title, message} : Notification) => {
        Store.addNotification({...notificationConfig, title: title, message: message, type: "warning"});
    };

    public static Error = ({title, message} : Notification) => {
        Store.addNotification({...notificationConfig, title: title, message: message, type: "danger"});
    };
}
