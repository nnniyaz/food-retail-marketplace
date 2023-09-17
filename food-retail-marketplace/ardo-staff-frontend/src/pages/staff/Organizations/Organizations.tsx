import React, {FC, useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {Card, Table} from "antd";
import {ColumnsType} from "antd/es/table";
import {TableParams} from "entities/base/tableParams";
import {Organization} from "entities/organization/organization";
import {txt} from "shared/core/i18ngen";
import {Filters} from "shared/ui/Filters";
import {useActions} from "shared/lib/hooks/useActions";
import {dateFormat} from "shared/lib/utils/date-format";
import {TableHeader} from "shared/ui/TableTools/TableHeader";
import {useTypedSelector} from "shared/lib/hooks/useTypedSelector";
import {RouteNames} from "../../index";
import classes from "./Organizations.module.scss";

export const Organizations: FC = () => {
    const navigate = useNavigate();
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
    const [filters, setFilters] = useState({isDeleted: false});

    const columns: ColumnsType<Organization> = [
        {
            key: "action",
            title: txt.action[currentLang],
            dataIndex: "action",
            render: (_, record) => (
                <Link to={RouteNames.ORGANIZATIONS_EDIT.replace(":id", record?.id)}>
                    {txt.details[currentLang]}
                </Link>
            )
        },
        {key: "id", title: txt.id[currentLang], dataIndex: "id"},
        {key: "name", title: txt.name[currentLang], dataIndex: "name"},
        {key: "currency", title: txt.currency[currentLang], dataIndex: "currency"},
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
            render: (createdAt: Timestamp) => dateFormat(createdAt)
        },
    ];

    const data: Organization[] = organizations.map(item => ({...item, key: item.id})) || [];

    const filterIsDeletedOptions = [
        {label: txt.yes[currentLang], value: true},
        {label: txt.no[currentLang], value: false}
    ];

    const handleSearch = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent> | React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
    }

    const handleOnAddOrg = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent> | React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        navigate(RouteNames.ORGANIZATIONS_ADD);
    }

    useEffect(() => {
        const controller = new AbortController();
        fetchOrganizations({
            limit: pagination.pagination?.pageSize || 25,
            offset: pagination.pagination?.current! - 1,
            is_deleted: filters.isDeleted
        }, controller);
        return () => controller.abort();
    }, [pagination.pagination?.current, pagination.pagination?.pageSize, filters.isDeleted]);

    return (
        <div className={classes.main}>
            <Card bodyStyle={{padding: "20px 10px 10px 10px", borderRadius: "8px"}}>
                <TableHeader
                    searchPlaceholder={txt.search_org_by_name_id[currentLang]}
                    onSearch={handleSearch}
                    onSearchText={txt.search[currentLang]}
                    onSubButtonClick={handleOnAddOrg}
                    onSubButtonText={txt.add_organization[currentLang]}
                />
                <Filters
                    filters={[
                        {
                            label: txt.deleted_organizations[currentLang],
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
                    loading={isLoadingGetOrganizations}
                    scroll={{x: 500}}
                    pagination={pagination.pagination}
                    onChange={(pagination) => setPagination({pagination})}
                />
            </Card>
        </div>
    )
}
