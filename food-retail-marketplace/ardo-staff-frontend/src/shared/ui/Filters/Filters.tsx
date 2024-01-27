import React, {FC} from "react";
import {Select} from "antd";
import classes from "./Filters.module.scss";

interface FilterItemProps {
    label: string;
    value: any;
    onChange: (...args: any[]) => void;
    options: { value: any, label: string }[];
    defaultValue: any;
}

const FilterItem: FC<FilterItemProps> = ({label, value, onChange, options, defaultValue}) => {
    return (
        <div className={classes.filters__item}>
            <div className={classes.filters__item__label}>{`${label}:`}</div>
            <Select
                value={value}
                onChange={onChange}
                options={options}
                defaultValue={defaultValue}
            />
        </div>
    )
}

interface FiltersProps {
    filters: FilterItemProps[];
}

export const Filters: FC<FiltersProps> = ({filters}) => {
    return (
        <div className={classes.filters}>
            {filters.map((filter, index) => (
                <FilterItem
                    key={index}
                    label={filter.label}
                    value={filter.value}
                    onChange={filter.onChange}
                    options={filter.options}
                    defaultValue={filter.defaultValue}
                />
            ))}
        </div>
    )
}
