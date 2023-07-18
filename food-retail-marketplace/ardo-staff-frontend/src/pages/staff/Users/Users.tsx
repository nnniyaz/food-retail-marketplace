import {FC, useEffect, useState} from "react";
import {Card, Table} from "antd";
import {ColumnsType} from "antd/es/table";
import {User} from "entities/user/user";
import {Paginate} from "entities/base/paginate";
import {txt} from "shared/core/i18ngen";
import {useActions} from "shared/lib/hooks/useActions";
import {useTypedSelector} from "shared/lib/hooks/useTypedSelector";
import classes from "./Users.module.scss";

export const Users: FC = () => {
    const {currentLang} = useTypedSelector(state => state.lang);
    const {users, isLoadingGetUsers} = useTypedSelector(state => state.users);
    const {fetchUsers} = useActions();
    const [pagination, setPagination] = useState<Paginate>({offset: 1, limit: 25, is_deleted: false});

    const columns: ColumnsType<User> = [
        {title: txt.id[currentLang], dataIndex: "id"},
        {title: txt.first_name[currentLang], dataIndex: "firstName"},
        {title: txt.last_name[currentLang], dataIndex: "lastName"},
        {title: txt.email[currentLang], dataIndex: "email"},
        {title: txt.user_type[currentLang], dataIndex: "userType"},
        {title: txt.is_deleted[currentLang], dataIndex: "isDeleted"},
        {title: txt.created_at[currentLang], dataIndex: "createdAt"},
        {title: txt.updated_at[currentLang], dataIndex: "updatedAt"},
    ];

    const data: User[] = users || [];

    useEffect(() => {
        const controller = new AbortController();
        fetchUsers({...pagination, offset: pagination.offset! - 1}, controller);
        return () => controller.abort();
    }, []);

    return (
        <div className={classes.main}>
            <Card bodyStyle={{padding: "10px"}}>
                <Table columns={columns} dataSource={data} loading={isLoadingGetUsers}/>
            </Card>
        </div>
    )
}
