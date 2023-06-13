import React, {FC} from "react";
import {Loader} from "../Loader";
import classes from "./Table.module.scss";

export type TableColumn = {
    title: string;
    dataIndex: string;
    render?: (value: any) => React.ReactNode;
}

export type TableData = {
    [key: string]: any;
}

interface TableProps {
    columns: TableColumn[];
    data: TableData[];
    loading?: boolean;
}

export const Table: FC<TableProps> = ({data, columns, loading}) => {
    const rows = data.map((item, index) => (
        <tr className={classes.table__row} key={index}>
            {columns.map(column => (
                <td className={classes.table__data_cell} key={column.dataIndex}>
                    {column.render ? column.render(item[column.dataIndex]) : item[column.dataIndex]}
                </td>
            ))}
        </tr>
    ));

    const loader = (
        <tr className={classes.table__row__loading}>
            <td className={classes.table__data__cell__loading}>
                <Loader/>
            </td>
        </tr>
    )

    return (
        <React.Fragment>
            <table className={classes.table}>
                <thead className={classes.table__head}>
                <tr className={classes.table__row}>
                    {columns.map(column =>
                        <th className={classes.table__data__head} key={column.dataIndex}>{column.title}</th>
                    )}
                </tr>
                </thead>
                <tbody className={classes.table__body}>
                {loading ? loader : rows}
                </tbody>
            </table>
            <div></div>
        </React.Fragment>
    )
}
