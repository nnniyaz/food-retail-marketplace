import React, {FC, useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {Card, Table} from "antd";
import {ColumnsType} from "antd/es/table";
import {RouteNames} from "@pages//";
import {TableParams} from "@entities/base/tableParams";
import {User, UserType} from "@entities/user/user";
import {CountryCodes, Phone} from "@entities/base/phone";
import {txt} from "@shared/core/i18ngen";
import {Filters} from "@shared/ui/Filters";
import {useActions} from "@shared/lib/hooks/useActions";
import {phoneFormat} from "@shared/lib/phone/phoneFormat";
import {TableHeader} from "@shared/ui/TableTools/TableHeader";
import {useTypedSelector} from "@shared/lib/hooks/useTypedSelector";
import {userTypeTranslate} from "@shared/lib/options/userTypeOptions";
import classes from "./Users.module.scss";

export const Users: FC = () => {
    const navigate = useNavigate();
    const {currentLang} = useTypedSelector(state => state.lang);
    const {users, usersCount, isLoadingGetUsers} = useTypedSelector(state => state.users);
    const {fetchUsers} = useActions();
    const [pagination, setPagination] = useState<TableParams>({
        pagination: {
            current: 1,
            pageSize: 25,
            total: usersCount
        }
    });
    const [filters, setFilters] = useState({isDeleted: false});

    const columns: ColumnsType<User> = [
        {
            key: "action",
            title: txt.action[currentLang],
            dataIndex: "action",
            render: (_, record) => (
                <Link to={RouteNames.USERS_EDIT.replace(":id", record?.id)}>{txt.details[currentLang]}</Link>
            )
        },
        {
            key: "id",
            title: txt.id[currentLang],
            dataIndex: "id"
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
        {
            key: "phone",
            title: txt.phone[currentLang],
            dataIndex: "phone",
            render: (phone: Phone) => phone?.countryCode && phone?.number ? `${CountryCodes[phone.countryCode].dialCode} ${phoneFormat(phone.number, phone.countryCode)}` : ""
        },
        {
            key: "email",
            title: txt.email[currentLang],
            dataIndex: "email"
        },
        {
            key: "userType",
            title: txt.user_type[currentLang],
            dataIndex: "userType",
            render: (userType: UserType) => userTypeTranslate(userType, currentLang)
        },
    ];

    const data: User[] = users?.map(user => ({...user, key: user.id})) || [];

    const filterIsDeletedOptions = [
        {label: txt.yes[currentLang], value: true},
        {label: txt.no[currentLang], value: false}
    ];

    const handleSearch = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent> | React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
    }

    const handleOnAddUser = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent> | React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        navigate(RouteNames.USERS_ADD);
    }

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
                    searchPlaceholder={txt.search_user_by_id_first_name_last_name_email[currentLang]}
                    onSearch={handleSearch}
                    onSearchText={txt.search[currentLang]}
                    onSubButtonClick={handleOnAddUser}
                    onSubButtonText={txt.add_user[currentLang]}
                />
                <Filters
                    filters={[
                        {
                            label: txt.deleted_users[currentLang],
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
                    loading={isLoadingGetUsers}
                    scroll={{x: 500}}
                    pagination={pagination.pagination}
                    onChange={(pagination) => setPagination({pagination})}
                    bordered={true}
                />
            </Card>
        </div>
    )
}
