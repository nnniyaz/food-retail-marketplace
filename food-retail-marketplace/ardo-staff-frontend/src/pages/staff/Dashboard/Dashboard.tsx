import React, {FC, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {txt} from "@shared/core/i18ngen";
import {Table} from "@shared/ui/TableTools/Table";
import {useActions} from "@shared/lib/hooks/useActions";
import {useTypedSelector} from "@shared/lib/hooks/useTypedSelector";
import {Block} from "./components/Block";
import classes from "./Dashboard.module.scss";

const requestOptions = {
    offset: 0,
    limit: 5,
    search: "",
    is_deleted: false,
}

export const Dashboard: FC = () => {
    const navigate = useNavigate();
    const {currentLang} = useTypedSelector(state => state.lang);
    const {isLoadingGetUsers, users} = useTypedSelector(state => state.users);
    const {isLoadingGetOrganizations, organizations} = useTypedSelector(state => state.organizations);
    const {fetchUsers, fetchOrganizations} = useActions();

    const usersColumns = [
        {title: txt.fullName[currentLang], dataIndex: "fullName"},
        {title: txt.type[currentLang], dataIndex: "userType"}
    ];
    const usersData = users?.slice(0, 5)?.map(user => ({
        fullName: `${user.firstName} ${user.lastName}`,
        userType: user.userType,
    })) || [];

    const organizationsColumns = [
        {title: txt.org_name[currentLang], dataIndex: "orgName"},
    ];
    const organizationsData = organizations?.slice(0, 5)?.map(org => ({
        orgName: org.name,
    })) || [];

    const applicationsColumns = [];
    const applicationsData = [];

    useEffect(() => {
        const controller = new AbortController();
        fetchUsers(requestOptions, controller, {navigate});
        return () => controller.abort();
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        fetchOrganizations(requestOptions, controller);
        return () => controller.abort();
    }, []);

    return (
        <div className={classes.main}>
            <Block label={txt.users[currentLang]}>
                <Table data={usersData} columns={usersColumns} loading={isLoadingGetUsers}/>
            </Block>
            <Block label={txt.organizations[currentLang]}>
                <Table data={organizationsData} columns={organizationsColumns} loading={isLoadingGetOrganizations}/>
            </Block>
            <Block label={txt.applications[currentLang]}>
                <Table data={[]} columns={[]} loading={false}/>
            </Block>
        </div>
    )
}
