"use client";
import { Col, Row, Table, Typography } from "antd";
import {
    useGetTournamentByIdQuery,
    useGetTournamentParticipantsQuery,
} from "@/services/Tournament/tournament";
import { useParams } from "next/navigation";
import { ParticipantsModel } from "@/shared/types/models/Tournament";
import Link from "next/link";
import { CountryFlag } from "@/components/CountryFlag";
import React, { useState } from "react";
import { AlignType } from "rc-table/es/interface";
import { TeamLogo } from "../TournamentPlaying/TeamLogo";
import { useMemo } from "react";

const columns = [
    {
        title: "Аккаунт",
        dataIndex: "account",
        key: "account",

        render: (item: ParticipantsModel["account"]) => {
            return (
                <>
                    <Link href={`/account/${item.user.id}`}>{item?.login}</Link>
                    <br />
                    <Typography.Text
                        style={{ fontSize: 10 }}
                        type={"secondary"}
                    >
                        {item?.platform.name}
                    </Typography.Text>
                </>
            );
        },
    },
    {
        title: "Имя",
        dataIndex: ["account", "user"],
        key: "account",
        render: (item: ParticipantsModel["account"]["user"]) => {
            return (
                <Typography.Text style={{ fontSize: 16 }}>
                    {`${item?.surname} ${item?.name}`}
                </Typography.Text>
            );
        },
    },
    // {
    //     title: "Пользователь",
    //     dataIndex: ["account", "user"],
    //     key: "account",
    //     render: (item: ParticipantsModel["account"]["user"]) => {
    //         return (
    //             <Link href={`/account/${item.id}`}>
    //                 {item?.name}&nbsp;{item?.surname}
    //             </Link>
    //         );
    //     },
    // },
    {
        title: "Местоположение",
        dataIndex: ["account"],
        key: "geo",
        align: "right" as AlignType,
        render: (item: ParticipantsModel["account"]) => {
            return (
                <span>
                    <CountryFlag
                        country={item?.user.country as string}
                        width={16}
                        height={16}
                    />{" "}
                    &nbsp;
                    {item?.user?.city}
                </span>
            );
        },
    },
];

const TournamentParticipants = () => {
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const { tournamentId } = useParams<{ tournamentId: string }>();
    const {
        data: participantsWithTeam,
        isLoading: isLoadingParticipantsWithTeam,
    } = useGetTournamentParticipantsQuery({
        id: tournamentId,
        // team_id__isnull: true,
        // is_team_shown: false,
        per_page: pageSize,
        order_by: "updated_at",
        page: currentPage,
        status: 3,
    });

    const { currentData: tournamentData } = useGetTournamentByIdQuery({
        id: tournamentId,
    });

    const finalColumns = useMemo(() => {
        if (tournamentData?.teams_used) {
            const team = {
                title: "Команда",
                dataIndex: "team",
                key: "team",
                render: (item: ParticipantsModel["team"]) => {
                    if (!item) return;
                    return (
                        <Row align={"middle"} gutter={[8, 8]}>
                            <Col>
                                <TeamLogo team={item} />
                            </Col>
                            <Col>
                                <Typography.Title level={5}>
                                    {item?.name}
                                </Typography.Title>
                            </Col>
                        </Row>
                    );
                },
            };
            // @ts-ignore
            return columns.toSpliced(2, 0, team);
        }
        return [...columns];
    }, [tournamentData?.teams_used]);

    return (
        <div style={{ height: "100%" }}>
            {participantsWithTeam && (
                <Table
                    loading={isLoadingParticipantsWithTeam}
                    dataSource={participantsWithTeam.payload}
                    columns={finalColumns}
                    pagination={{
                        defaultPageSize: pageSize,
                        total: participantsWithTeam.total_count,
                        current: participantsWithTeam.page,
                        pageSizeOptions: [10, 20, 50, 100, 500, 1000, 10000],
                    }}
                    onChange={(pagination) => {
                        setCurrentPage(pagination.current ?? 0);
                        setPageSize(pagination.pageSize ?? 10);
                    }}
                />
            )}
        </div>
    );
};

export default TournamentParticipants;
