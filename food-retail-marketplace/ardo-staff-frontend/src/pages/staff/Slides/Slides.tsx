import React, {FC, useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {Card, Table} from "antd";
import {ColumnsType} from "antd/es/table";
import {RouteNames} from "@pages/index";
import {Slide} from "@entities/slide/slide";
import {MlString} from "@entities/base/MlString";
import {TableParams} from "@entities/base/tableParams";
import {txt} from "@shared/core/i18ngen";
import {Filters} from "@shared/ui/Filters";
import {useActions} from "@shared/lib/hooks/useActions";
import {dateFormat} from "@shared/lib/date/date-format";
import {TableHeader} from "@shared/ui/TableTools/TableHeader";
import {useTypedSelector} from "@shared/lib/hooks/useTypedSelector";
import classes from "./Slides.module.scss";

export const Slides: FC = () => {
    const navigate = useNavigate();
    const {currentLang} = useTypedSelector(state => state.lang);
    const {slides, slidesCount, isLoadingGetSlides} = useTypedSelector(state => state.slides);
    const {fetchSlides} = useActions();
    const [pagination, setPagination] = useState<TableParams>({
        pagination: {
            current: 1,
            pageSize: 25,
            total: slidesCount
        }
    });
    const [filters, setFilters] = useState({isDeleted: false});

    const columns: ColumnsType<Slide> = [
        {
            key: "action",
            title: txt.action[currentLang],
            dataIndex: "action",
            render: (_, record) => (
                <Link to={RouteNames.SLIDES_EDIT.replace(":id", record?.id)}>{txt.details[currentLang]}</Link>
            )
        },
        {
            key: "img",
            title: txt.image[currentLang],
            dataIndex: "img",
            render: (img: string) => <img src={img} alt={txt.image[currentLang]} style={{width: "50px"}}/>
        },
        {
            key: "id",
            title: txt.id[currentLang],
            dataIndex: "id"
        },
        {
            key: "caption",
            title: txt.name[currentLang],
            dataIndex: "caption",
            render: (caption: MlString) => caption[currentLang]
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
            render: (updatedAt: Timestamp) => dateFormat(updatedAt)
        },
        {
            key: "version",
            title: txt.version[currentLang],
            dataIndex: "version",
            align: "center"
        },
    ];

    const data: Slide[] = slides?.map((slide) => ({...slide, key: slide.id})) || [];

    const filterIsDeletedOptions = [
        {label: txt.yes[currentLang], value: true},
        {label: txt.no[currentLang], value: false}
    ];

    const handleSearch = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent> | React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
    }

    const handleOnAddSlides = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent> | React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        navigate(RouteNames.SLIDES_ADD);
    }

    useEffect(() => {
        setPagination({
            pagination: {
                ...pagination.pagination,
                total: slidesCount
            }
        });
    }, [slidesCount]);

    useEffect(() => {
        const controller = new AbortController();
        fetchSlides({
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
                    searchPlaceholder={txt.search_slide_by_id_or_name[currentLang]}
                    onSearch={handleSearch}
                    onSearchText={txt.search[currentLang]}
                    onSubButtonClick={handleOnAddSlides}
                    onSubButtonText={txt.add_slide[currentLang]}
                />
                <Filters
                    filters={[
                        {
                            label: txt.deleted_sections[currentLang],
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
                    loading={isLoadingGetSlides}
                    scroll={{x: 500}}
                    pagination={pagination.pagination}
                    onChange={(pagination) => setPagination({pagination})}
                />
            </Card>
        </div>
    )
}
