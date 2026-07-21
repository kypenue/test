"use client";

import { Table, Row, Col } from "antd";
import useBreakpoint from "antd/es/grid/hooks/useBreakpoint";
import {
    useGetTournamentParticipantsQuery,
    useSetParticipantBlockMutation,
    useSetParticipantStatusMutation,
} from "@/services/Tournament/tournament";
import { ParticipantsModel } from "@/shared/types/models/Tournament";
import { useMemo, useState } from "react";
import { ColumnsType } from "antd/es/table";
import { ParticipantsFilter } from "@/components/ParticipantsFilter";
import { AccountCell, ActionCell, StatusCell, UserCell } from "@/components/ParticipantsCell";

const generateColumns = (
    changeStatus: (
        participantId: number,
        status: number,
        userId: number,
    ) => void,
    isMobile: boolean
): ColumnsType<ParticipantsModel> => {

    if (isMobile) {
        return [
            {
                title: "Участники",
                dataIndex: ["accounts"],

                key: "accounts",
                render: (_, record) => {


                    return (
                        <Row justify="end" gutter={[0, 12]}>
                            <Col span={24}>
                                <Row>
                                    <Col span={12}>Пользователь:</Col>
                                    <Col span={12}>
                                        <UserCell user={record.account?.user} />
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={24}>
                                <Row>
                                    <Col span={12}>Аккаунт:</Col>
                                    <Col span={12}>
                                        <AccountCell account={record.account} />
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={24}>
                                <Row>
                                    <Col span={12}>Статус:</Col>
                                    <Col span={12}>
                                        <StatusCell status={record.status} />
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={24}>
                                <Row>
                                    <Col span={12}>Действия:</Col>
                                    <Col span={12}>
                                        <ActionCell record={record} changeStatus={changeStatus} />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    );
                },
            }
        ];
    }

    return [
        {
            title: "Пользователь",
            dataIndex: ["account", "user"],
            key: "account",
            render: (item: ParticipantsModel["account"]["user"]) => {
                return (
                    <UserCell user={item} />
                );
            },
        },
        {
            title: "Аккаунт",
            dataIndex: "account",
            key: "account",
            render: (item: ParticipantsModel["account"]) => {
                return (
                    <AccountCell account={item} />
                );
            },
        },
        {
            title: "Статус",
            dataIndex: "status",
            key: "status",
            render: (item: ParticipantsModel["status"]) => {
                return (
                    <StatusCell status={item} />
                );
            },
        },
        {
            title: "Действия",
            dataIndex: "actions",
            key: "actions",
            render: (
                item: ParticipantsModel["status"],
                record: ParticipantsModel,
            ) => {
                return (
                    <ActionCell record={record} changeStatus={changeStatus} />
                );
            },
        },
    ]
};

const ParticipantsPage = ({ params }: { params: { tournamentId: string } }) => {
    const pageSize = 10;
    const breakpoints = useBreakpoint();
    const [statusFilter, setStatusFilter] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const { data, isFetching } = useGetTournamentParticipantsQuery(
        {
            id: params.tournamentId,
            per_page: pageSize,
            order_by: "-updated_at",
            page: currentPage,
            ...(statusFilter && { status: statusFilter }),
        },
        { refetchOnMountOrArgChange: true },
    );
    const [changeStatus] = useSetParticipantStatusMutation();
    const [blockUser] = useSetParticipantBlockMutation();

    const handleChangeStatus = (
        participantId: number,
        status: number,
        userId: number,
    ) => {
        if (status === 4) {
            return blockUser({ userId });
        }
        changeStatus({
            status,
            participantId,
            tournamentId: params.tournamentId,
        });
    };

    const columns = useMemo(() => {
        return generateColumns(handleChangeStatus, breakpoints.xs ?? false);
    }, [breakpoints]);

    return (
        <div>
            <ParticipantsFilter
                id={params.tournamentId}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ marginBottom: 16 }}
            />

            <Table
                dataSource={data?.payload}
                loading={isFetching}
                columns={columns}
                pagination={{
                    defaultPageSize: pageSize,
                    total: data?.total_count,
                    current: data?.page,
                    showSizeChanger: false,
                }}
                onChange={(pagination) =>
                    setCurrentPage(pagination.current ?? 0)
                }
            />
        </div>
    );
};

export default ParticipantsPage;
