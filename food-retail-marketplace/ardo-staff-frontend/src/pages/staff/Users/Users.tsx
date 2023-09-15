import {FC, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Button, Card, Input, Table} from "antd";
import {ColumnsType} from "antd/es/table";
import {User} from "entities/user/user";
import {TableParams} from "entities/base/tableParams";
import {txt} from "shared/core/i18ngen";
import {useActions} from "shared/lib/hooks/useActions";
import {dateFormat} from "shared/lib/utils/date-format";
import {TableHeader} from "shared/ui/TableTools/TableHeader";
import {useTypedSelector} from "shared/lib/hooks/useTypedSelector";
import {RouteNames} from "../../index";
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

    const columns: ColumnsType<User> = [
        {title: txt.id[currentLang], dataIndex: "id"},
        {title: txt.first_name[currentLang], dataIndex: "firstName"},
        {title: txt.last_name[currentLang], dataIndex: "lastName"},
        {title: txt.email[currentLang], dataIndex: "email"},
        {title: txt.user_type[currentLang], dataIndex: "userType"},
        {
            title: txt.is_deleted[currentLang],
            dataIndex: "isDeleted",
            render: (isDeleted: boolean) => isDeleted ? txt.yes[currentLang] : txt.no[currentLang]
        },
        {
            title: txt.created_at[currentLang],
            dataIndex: "createdAt",
            render: (createdAt: Timestamp) => dateFormat(createdAt)
        },
        {
            title: txt.updated_at[currentLang],
            dataIndex: "updatedAt",
            render: (updateAt: Timestamp) => dateFormat(updateAt)
        },
    ];

    const data: User[] = users || [];

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
        }, controller, {navigate: navigate});
        return () => controller.abort();
    }, [pagination.pagination?.current, pagination.pagination?.pageSize]);

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
                <Table
                    columns={columns}
                    dataSource={data}
                    loading={isLoadingGetUsers} scroll={{x: 500}}
                    pagination={pagination.pagination}
                    onChange={(pagination) => setPagination({pagination})}
                />
            </Card>
        </div>
    )
}
