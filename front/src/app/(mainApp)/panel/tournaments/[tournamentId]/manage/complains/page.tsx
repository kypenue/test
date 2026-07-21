"use client";

import { useMemo, useState } from "react";
import { Button, Table } from "antd";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import { ComplaintModel } from "@/shared/types/models/Complaints";
import {
    useGetComplaintsByTournamentQuery,
    useUpdateMatchComplaintsMutation,
} from "@/services/Complaints/complaints";
import { ComplaintsItem } from "@/components/Complaints/ComplaintsItem";

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
                    <p>{item.guest_player_account.login}</p>
                    <p>{item.home_player_account.login}</p>
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
                    <p>{item?.login}</p>
                    <p>
                        {item?.user.name}&nbsp;{item?.user.surname}
                    </p>
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
