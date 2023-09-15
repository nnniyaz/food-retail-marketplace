import {FC, useEffect, useState} from "react";
import {Card, Table} from "antd";
import {ColumnsType} from "antd/es/table";
import {Paginate} from "entities/base/paginate";
import {Organization} from "entities/organization/organization";
import {txt} from "shared/core/i18ngen";
import {useActions} from "shared/lib/hooks/useActions";
import {dateFormat} from "shared/lib/utils/date-format";
import {useTypedSelector} from "shared/lib/hooks/useTypedSelector";
import classes from "../Users/Users.module.scss";
import {TableParams} from "../../../entities/base/tableParams";

export const Organizations: FC = () => {
    const {currentLang} = useTypedSelector(state => state.lang);
    const {
        organizations,
        organizationsCount,
        isLoadingGetOrganizations
    } = useTypedSelector(state => state.organizations);
    const {fetchOrganizations} = useActions();
    const [pagination, setPagination] = useState<TableParams>({
        pagination: {
            current: 1,
            pageSize: 25,
            total: organizationsCount
        }
    });

    const columns: ColumnsType<Organization> = [
        {title: txt.id[currentLang], dataIndex: "id"},
        {title: txt.name[currentLang], dataIndex: "name"},
        {title: txt.currency[currentLang], dataIndex: "currency"},
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
            render: (createdAt: Timestamp) => dateFormat(createdAt)
        },
    ];

    const data: Organization[] = organizations || [];

    useEffect(() => {
        const controller = new AbortController();
        fetchOrganizations({
            limit: pagination.pagination?.pageSize || 25,
            offset: pagination.pagination?.current! - 1
        }, controller);
        return () => controller.abort();
    }, []);

    return (
        <div className={classes.main}>
            <Card bodyStyle={{padding: "10px", borderRadius: "8px"}}>
                <Table
                    columns={columns}
                    dataSource={data}
                    loading={isLoadingGetOrganizations}
                    pagination={pagination.pagination}
                />
            </Card>
        </div>
    )
}
