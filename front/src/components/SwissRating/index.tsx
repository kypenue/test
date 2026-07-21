import { useGetSwissStageRatingQuery } from "@/services/Stages/stages";
import {
    SWISS_RATING_STATUSES,
    SwissRatingModel,
} from "@/shared/types/models/Tournament";
import { Flex, TableColumnsType, Tooltip } from "antd";
import { MemoizedTable } from "@/components/MemoizedTable";
import { useMemo } from "react";
import useBreakpoint from "antd/es/grid/hooks/useBreakpoint";
import s from "./SwissRating.module.scss";
import { GamerStatus } from "@/components/SwissRating/GamerStatus";
import { GamerAccount } from "@/components/SwissRating/GamerAccount";
import { TeamLogo } from "@/components/TournamentPlaying/TeamLogo";
import { clsx } from "clsx";
import { formatPercentage } from "@/shared/lib/formatPercentage";

interface SwissRatingProps {
    tournamentId: string;
    stageId: string;
    swissStageId: string;
}

const getColumns: (
    tournamentId: string,
) => TableColumnsType<SwissRatingModel> = (tournamentId: string) => [
    {
        title: "#",
        dataIndex: "number",
        width: 60,
        key: "number",
    },
    {
        title: "Команда",
        width: 60,
        dataIndex: "team",
        key: "team",
        render: (team: SwissRatingModel["team"]) => (
            <TeamLogo isLarge={true} size={30} team={team || null} />
        ),
    },
    {
        title: "Участник",
        width: 240,
        dataIndex: "account",
        key: "account",
        render: (playerAccount: SwissRatingModel["account"]) => (
            <GamerAccount playerAccount={playerAccount} />
        ),
    },
    {
        title: "W",
        width: 40,
        dataIndex: "wins_number",
        key: "wins_number",
    },
    {
        title: "L",
        width: 40,
        dataIndex: "loses_number",
        key: "loses_number",
    },
    {
        title: (
            <Tooltip title={"Процент побед оппонентов участника"}>
                OWA, %
            </Tooltip>
        ),
        width: 90,
        dataIndex: "opponent_win_average",
        key: "opponent_win_average",
        render: (item: SwissRatingModel["opponent_win_average"]) =>
            (item * 100).toFixed(3),
    },
    {
        title: (
            <Tooltip title={"Средняя разница голов оппонентов участника"}>
                OGDA
            </Tooltip>
        ),
        width: 80,
        dataIndex: "opponent_goals_difference_average",
        key: "opponent_goals_difference_average",
        render: (item: SwissRatingModel["opponent_goals_difference_average"]) =>
            item?.toFixed(3),
    },
    {
        title: "Последние игры",
        width: "180px",
        dataIndex: "series",
        key: "series",
        render: (item: SwissRatingModel["series"]) => {
            return (
                <Flex gap={4}>
                    {item.map((series) => (
                        <GamerStatus
                            key={series.id}
                            series={series}
                            tournamentId={tournamentId}
                        />
                    ))}
                </Flex>
            );
        },
    },
    {
        title: "Статус",
        dataIndex: "status",
        width: 140,
        key: "status",

        render: (item: SwissRatingModel["status"]) => (
            <p className={clsx(s.status, s.lower)}>
                {SWISS_RATING_STATUSES[item]}
            </p>
        ),
    },
];

const smallColumns: (
    tournamentId: string,
) => TableColumnsType<SwissRatingModel> = (tournamentId: string) => [
    {
        title: "Рейтинг",
        width: 240,
        dataIndex: "account",
        responsive: ["xs", "sm"],
        render: (
            playerAccount: SwissRatingModel["account"],
            record: SwissRatingModel,
        ) => {
            return (
                <div className={s.card}>
                    <Flex justify={"space-between"} className={s.header}>
                        <p className={clsx(s.status, s.lower)}>
                            #{record.number}
                        </p>{" "}
                        <p className={clsx(s.status, s.lower, s.right)}>
                            {SWISS_RATING_STATUSES[record.status]}
                        </p>
                    </Flex>
                    <Flex justify={"space-between"}>
                        <GamerAccount playerAccount={playerAccount} />
                        <Flex style={{ flexDirection: "column" }} gap={8}>
                            <p className={clsx(s.status, s.right)}>
                                OWA:{" "}
                                {formatPercentage(record?.opponent_win_average)}
                            </p>
                            <p className={clsx(s.status, s.right)}>
                                OGDA:{" "}
                                {record?.opponent_goals_difference_average?.toFixed(
                                    3,
                                )}
                            </p>
                        </Flex>
                    </Flex>
                    <div>
                        W{record.wins_number} L{record.loses_number}
                    </div>
                    <Flex gap={4}>
                        {record.series.map((series) => (
                            <GamerStatus
                                key={series.id}
                                series={series}
                                tournamentId={tournamentId}
                            />
                        ))}
                    </Flex>
                </div>
            );
        },
    },
];

export const SwissRating = ({
    tournamentId,
    stageId,
    swissStageId,
}: SwissRatingProps) => {
    const { md } = useBreakpoint();
    const { currentData, isLoading } = useGetSwissStageRatingQuery({
        tournamentId,
        stageId,
        swissStageId,
        per_page: 10000,
    });
    console.log("currentData: ", currentData);
    const columns = useMemo(() => {
        if (md) {
            return getColumns(tournamentId);
        }
        return smallColumns(tournamentId);
    }, [tournamentId, md]);

    return (
        <MemoizedTable<SwissRatingModel>
            columns={columns}
            style={{ width: "100%" }}
            dataSource={currentData?.payload ?? []}
            loading={isLoading}
            pagination={false}
            rowKey={"account.id"}
            //scroll={{ y: 500 }}
        />
    );
};
