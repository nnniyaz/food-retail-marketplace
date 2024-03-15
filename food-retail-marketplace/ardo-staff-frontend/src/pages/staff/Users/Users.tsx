import React, {FC, useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {Card, Table} from "antd";
import {ColumnsType} from "antd/es/table";
import {Langs} from "@entities/base/MlString";
import {TableParams} from "@entities/base/tableParams";
import {User, UserType} from "@entities/user/user";
import {txt} from "@shared/core/i18ngen";
import {Filters} from "@shared/ui/Filters";
import {useActions} from "@shared/lib/hooks/useActions";
import {dateFormat} from "@shared/lib/date/date-format";
import {TableHeader} from "@shared/ui/TableTools/TableHeader";
import {useTypedSelector} from "@shared/lib/hooks/useTypedSelector";
import {userTypeTranslate} from "@shared/lib/options/userTypeOptions";
import {RouteNames} from "@pages//";
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
        {
            key: "preferredLang",
            title: txt.preferred_lang[currentLang],
            dataIndex: "preferredLang",
            render: (preferredLang: Langs) => preferredLang
        },
        {
            key: "isDeleted",
            title: txt.is_deleted[currentLang],
            dataIndex: "isDeleted",
            render: (isDeleted: boolean) => isDeleted ? txt.yes[currentLang] : txt.no[currentLang]
        },
        {
            key: "createdAt",
            title: txt.created_at[currentLang],
            dataIndex: "createdAt",
            render: (createdAt: Timestamp) => dateFormat(createdAt)
        },
        {
            key: "updatedAt",
            title: txt.updated_at[currentLang],
            dataIndex: "updatedAt",
            render: (updateAt: Timestamp) => dateFormat(updateAt)
        },
        {
            key: "version",
            title: txt.version[currentLang],
            dataIndex: "version",
            align: "center"
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
        const controller = new AbortController();
        fetchUsers({
            limit: pagination.pagination?.pageSize || 25,
            offset: pagination.pagination?.current! - 1,
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
                />
            </Card>
        </div>
    )
}
