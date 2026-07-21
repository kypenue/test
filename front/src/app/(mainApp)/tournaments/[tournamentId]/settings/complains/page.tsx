"use client";

import { useMemo, useState } from "react";
import { Button, Table, Typography } from "antd";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import { ComplaintModel } from "@/shared/types/models/Complaints";
import {
    useGetComplaintsByTournamentQuery,
    useUpdateMatchComplaintsMutation,
} from "@/services/Complaints/complaints";
import { ComplaintsItem } from "@/components/Complaints/ComplaintsItem";
import s from "./style.module.scss";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

const generateColumns = (
    changeStatus: (
        seriesId: string,
        status: number,
        matchId: string,
        complaintId: string,
    ) => void,
): ColumnsType<ComplaintModel> => [
    {
        title: "Участники",
        dataIndex: "match",
        key: "match",
        render: (item: ComplaintModel["match"]) => {
            return (
                <div>
                    <Typography.Paragraph className={s.text}>
                        {item.guest_player_account.login}
                    </Typography.Paragraph>
                    <Typography.Paragraph className={s.text}>
                        {item.home_player_account.login}
                    </Typography.Paragraph>
                </div>
            );
        },
    },
    {
        title: "Автор",
        dataIndex: "author",
        key: "author",
        render: (item: ComplaintModel["author"]) => {
            return (
                <>
                    <Typography.Paragraph className={s.text}>
                        {item?.login} ({item?.user.name}&nbsp;
                        {item?.user.surname})
                    </Typography.Paragraph>
                    <Typography.Paragraph className={s.text} type={"secondary"}>
                        {dayjs
                            .utc(item.created_at, "YYYY-MM-DD")
                            .format("HH:mm D MMMM")}
                    </Typography.Paragraph>
                </>
            );
        },
    },
    {
        title: "Тип жалобы",
        dataIndex: "creation_way",
        key: "creation_way",
        render: (item: ComplaintModel["creation_way"]) => {
            return (
                <>
                    <Typography.Paragraph className={s.text}>
                        {item === 1 ? "🖐️ Ручная" : "🤖 Автоматическая"}
                    </Typography.Paragraph>
                </>
            );
        },
    },
    {
        title: "Действия",
        dataIndex: "actions",
        align: "end",
        key: "actions",
        render: (item: ComplaintModel["status"], record: ComplaintModel) => {
            return (
                <div
                    style={{
                        display: "flex",
                        gap: "16px",
                        justifyContent: "end",
                    }}
                >
                    <Button
                        type="primary"
                        href={`/tournaments/${record.tournament_id}/series/${record.series_id}/match/${record.match.id}`}
                    >
                        Перейти к жалобе
                    </Button>
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            changeStatus(
                                record.series_id,
                                4,
                                record.match.id,
                                record.id,
                            );
                        }}
                    >
                        Закрыть жалобу
                    </Button>
                </div>
            );
        },
    },
];

const ComplaintsPage = ({ params }: { params: { tournamentId: string } }) => {
    const pageSize = 10;
    const [currentPage, setCurrentPage] = useState(1);

    const { currentData, isLoading } = useGetComplaintsByTournamentQuery({
        tournamentId: params.tournamentId,
        per_page: pageSize,
        page: currentPage,
        order_by: "-created_at",
    });

    const [changeStatus] = useUpdateMatchComplaintsMutation();

    const handleChangeStatus = (
        seriesId: string,
        status: number,
        matchId: string,
        complaintId: string,
    ) => {
        changeStatus({
            status,
            seriesId,
            matchId,
            complaintId,
            tournamentId: params.tournamentId,
        });
    };

    const columns = useMemo(() => {
        return generateColumns(handleChangeStatus);
    }, []);

    const data = useMemo(() => {
        return currentData?.payload.map((current) => {
            return { key: current.id, ...current };
        });
    }, [currentData]);

    return (
        <div>
            {currentData?.payload && (
                <Table
                    dataSource={data}
                    loading={isLoading}
                    scroll={{ y: "70vh" }}
                    columns={columns}
                    pagination={{
                        defaultPageSize: pageSize,
                        total: currentData.total_count,
                        current: currentData.page,
                        showSizeChanger: false,
                    }}
                    expandable={{
                        expandRowByClick: true,
                        expandedRowRender: (record) => (
                            <ComplaintsItem
                                complaint={record}
                                isAdmin={false}
                            />
                        ),
                        expandIcon: ({ expanded, onExpand, record }) =>
                            expanded ? (
                                <UpOutlined
                                    onClick={(e) => onExpand(record, e)}
                                />
                            ) : (
                                <DownOutlined
                                    onClick={(e) => onExpand(record, e)}
                                />
                            ),
                    }}
                    onChange={(pagination) =>
                        setCurrentPage(pagination.current ?? 0)
                    }
                />
            )}
        </div>
    );
};

export default ComplaintsPage;
