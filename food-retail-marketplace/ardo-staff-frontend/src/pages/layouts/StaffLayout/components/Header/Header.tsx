import React, {FC} from "react";
import {MenuUnfoldOutlined} from "@ant-design/icons";
import {Transition, TransitionStatus} from "react-transition-group";
import {Logo} from "shared/ui/Logo";
import {Text} from "shared/ui/Text";
import {useTypedSelector} from "shared/lib/hooks/useTypedSelector";
import classes from "./Header.module.scss";

interface HeaderProps {
    isShown: boolean;
    setIsShown: React.Dispatch<React.SetStateAction<boolean>>
}

export const Header: FC<HeaderProps> = ({isShown, setIsShown}) => {
    const {user} = useTypedSelector(state => state.user);
    const data = {
        firstName: user.firstName || "-",
        lastName: user.lastName || "-",
        role: user.userType || "Role",
    }
    const transitionClasses: Record<TransitionStatus, string> = {
        entering: classes.header__enter__active,
        entered: classes.header__enter__done,
        exiting: classes.header__exit__active,
        exited: classes.header__exit__done,
        unmounted: classes.header__exit__done,
    }

    return (
        <Transition in={!isShown} timeout={200} mountOnEnter unmountOnExit>
            {state => (
                <div className={`${classes.header} ${transitionClasses[state]}`}>
                    <div className={classes.header__item}>
                        <Logo/>
                    </div>
                    <div className={classes.header__item}>
                        <MenuUnfoldOutlined className={classes.burger} onClick={() => setIsShown(true)}/>
                    </div>
                    <div className={classes.header__item}>
                        <AccountBlock firstName={data.firstName} lastName={data.lastName} role={data.role}/>
                    </div>
                </div>
            )}
        </Transition>
    )
}

interface AccountBlockProps {
    firstName: string;
    lastName: string;
    role: string;
}

const AccountBlock: FC<AccountBlockProps> = ({firstName, lastName, role}) => {
    return (
        <div className={classes.account__block}>
            <div className={classes.account__avatar}>
                {`${firstName[0]}${lastName[0]}`}
            </div>
            <div className={classes.account__info}>
                <Text text={`${firstName} ${lastName}`} type={"text-small"}/>
                <Text text={role} type={"text-small"}/>
            </div>
        </div>
    )
}
