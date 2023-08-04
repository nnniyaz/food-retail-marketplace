import {FC, useEffect, useState} from "react";
import classes from "../Users/Users.module.scss";
import {Card, Table} from "antd";
import {useTypedSelector} from "../../../shared/lib/hooks/useTypedSelector";
import {useActions} from "../../../shared/lib/hooks/useActions";
import {Paginate} from "../../../entities/base/paginate";
import {ColumnsType} from "antd/es/table";
import {Organization} from "../../../entities/organization/organization";
import {txt} from "../../../shared/core/i18ngen";

export const Organizations: FC = () => {
    const {currentLang} = useTypedSelector(state => state.lang);
    const {organizations, isLoadingGetOrganizations} = useTypedSelector(state => state.organizations);
    const {fetchOrganizations} = useActions();
    const [pagination, setPagination] = useState<Paginate>({offset: 1, limit: 25, is_deleted: false});

    const columns: ColumnsType<Organization> = [
        {title: txt.id[currentLang], dataIndex: "id"},
        {title: txt.name[currentLang], dataIndex: "name"},
        {title: txt.currency[currentLang], dataIndex: "currency"},
        {title: txt.is_deleted[currentLang], dataIndex: "isDeleted"},
        {title: txt.created_at[currentLang], dataIndex: "createdAt"},
        {title: txt.updated_at[currentLang], dataIndex: "updatedAt"},
    ];

    const data: Organization[] = organizations || [];

    useEffect(() => {
        const controller = new AbortController();
        fetchOrganizations({...pagination, offset: pagination.offset! - 1}, controller);
        return () => controller.abort();
    }, []);

    return (
        <div className={classes.main}>
            <Card bodyStyle={{padding: "10px"}}>
                <Table columns={columns} dataSource={data} loading={isLoadingGetOrganizations}/>
            </Card>
        </div>
    )
}
