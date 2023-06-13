import React, {FC, useEffect} from "react";
import {txt} from "shared/core/i18ngen";
import {Table} from "shared/ui/Table";
import {useTypedSelector} from "shared/lib/hooks/useTypedSelector";
import {Block} from "./components/Block";
import classes from "./Dashboard.module.scss";
import {useActions} from "../../../shared/lib/hooks/useActions";

const requestOptions = {
    offset: 0,
    limit: 5,
    search: "",
    isDeleted: false,
}

export const Dashboard: FC = () => {
    const {currentLang} = useTypedSelector(state => state.lang);
    const {isLoadingGetUsers, users, usersCount} = useTypedSelector(state => state.user);
    const {getUsers} = useActions();

    const usersColumns = [
        {
            title: txt.fullName[currentLang],
            dataIndex: "fullName",
        },
        {
            title: txt.email[currentLang],
            dataIndex: "email",
        },
        {
            title: txt.type[currentLang],
            dataIndex: "userType",
        }
    ];
    const usersData = users.map(user => ({
        fullName: `${user.firstName} ${user.lastName}`,
        email: user.email,
        userType: user.userType,
    }));

    useEffect(() => {
        const controller = new AbortController();
        getUsers(requestOptions, controller);
        return () => controller.abort();
    }, [])

    return (
        <div className={classes.main}>
            <Block label={txt.users[currentLang]}>
                <Table data={usersData} columns={usersColumns} loading={isLoadingGetUsers}/>
            </Block>
            <Block label={txt.organizations[currentLang]}>Organizations</Block>
            <Block label={txt.applications[currentLang]}>Applications</Block>
        </div>
    )
}
