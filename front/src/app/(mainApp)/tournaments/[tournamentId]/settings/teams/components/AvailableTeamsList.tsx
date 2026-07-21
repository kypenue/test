import { Col, Empty, Input, Pagination, Row, Spin, Segmented } from "antd";
import {
    useGetAvailableTeamsQuery,
    useCopyTeamToTournamentMutation,
    useDeleteTournamentTeamMutation,
} from "@/services/Teams";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import { TeamItem } from "@/components/ProfileTeams/ProfileTeamsList/TeamItem";
import { SearchOutlined } from "@ant-design/icons";
import type { ProfileTeam } from "@/services/Teams/teams.model";
import { useGetTournamentByIdQuery } from "@/services/Tournament/tournament";

interface AvailableTeamsListProps {}

const FILTERS = [
    { label: "Все", value: "all" as const },
    { label: "Общедоступные", value: "public" as const },
    { label: "Команды организатора", value: "creator" as const },
];

export const AvailableTeamsList = ({}: AvailableTeamsListProps) => {
    const params = useParams<{ tournamentId: string }>();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchValue, setSearchValue] = useState("");
    const [debouncedSearch] = useDebounceValue(searchValue, 500);
    const [filterType, setFilterType] = useState<"all" | "public" | "creator">(
        "all",
    );

    const { data: tournament } = useGetTournamentByIdQuery({
        id: params.tournamentId,
    });

    const { currentData: availableTeams, isLoading } =
        useGetAvailableTeamsQuery(
            {
                tournament_id: Number(params.tournamentId),
                page: currentPage,
                per_page: pageSize,
                game_id: tournament?.game.id,
                ...(debouncedSearch && { search: debouncedSearch }),
                ...(filterType === "public" && {
                    access_type: "PUBLIC" as const,
                }),
                ...(filterType === "creator" && {
                    creator_id: tournament?.creator.id,
                    access_type: "PRIVATE",
                }),
            },
            { skip: !tournament?.id },
        );

    const [copyTeam] = useCopyTeamToTournamentMutation();
    const [deleteTeam] = useDeleteTournamentTeamMutation();

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
        setCurrentPage(1);
    };

    const handleFilterChange = (value: string) => {
        setFilterType(value as "all" | "public" | "creator");
        setCurrentPage(1);
    };

    const handlePageChange = (page: number, size?: number) => {
        setCurrentPage(page);
        if (size) {
            setPageSize(size);
        }
    };

    const handleCopyTeam = async (
        team: ProfileTeam,
        accessType: "TOURNAMENT" | "TOURNAMENT_INTERNAL",
    ) => {
        try {
            await copyTeam({
                tournament_id: Number(params.tournamentId),
                team_id: team.id,
                access_type: accessType,
            }).unwrap();
        } catch (error) {
            console.error("Error copying team:", error);
        }
    };

    const handleDeleteTeam = async (team: ProfileTeam) => {
        try {
            await deleteTeam({
                tournament_id: Number(params.tournamentId),
                team_id: team.id,
            }).unwrap();
        } catch (error) {
            console.error("Error deleting team:", error);
        }
    };

    return (
        <div>
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24}>
                    <Input
                        placeholder="Поиск доступных команд"
                        value={searchValue}
                        onChange={handleSearchChange}
                        suffix={<SearchOutlined />}
                        size="large"
                        allowClear
                    />
                </Col>
                <Col xs={24}>
                    <Segmented
                        options={FILTERS}
                        value={filterType}
                        onChange={handleFilterChange}
                        style={{ marginBottom: 16 }}
                    />
                </Col>
            </Row>

            {isLoading && (
                <div style={{ textAlign: "center", padding: "50px" }}>
                    <Spin size="large" />
                </div>
            )}

            {availableTeams && (
                <>
                    {availableTeams.payload.length > 0 ? (
                        <Row gutter={[16, 16]}>
                            <Col xs={24}>
                                {availableTeams.payload.map((team) => (
                                    <div
                                        key={team.id}
                                        style={{ marginBottom: 16 }}
                                    >
                                        <TeamItem
                                            {...team}
                                            variant="copy"
                                            onCopyTeam={handleCopyTeam}
                                            onDeleteTeam={handleDeleteTeam}
                                        />
                                    </div>
                                ))}
                            </Col>
                        </Row>
                    ) : (
                        <Empty
                            description={
                                debouncedSearch
                                    ? "Команды не найдены"
                                    : "Нет доступных команд"
                            }
                            style={{ marginTop: 40 }}
                        />
                    )}
                </>
            )}

            {availableTeams && availableTeams.payload.length > 0 && (
                <Row justify="center" style={{ marginTop: 24 }}>
                    <Pagination
                        current={currentPage}
                        total={availableTeams.total_count}
                        pageSize={pageSize}
                        onChange={handlePageChange}
                        onShowSizeChange={handlePageChange}
                        showSizeChanger
                        showQuickJumper
                        showTotal={(total, range) =>
                            `${range[0]}-${range[1]} из ${total} команд`
                        }
                        pageSizeOptions={["10", "20", "50", "100"]}
                    />
                </Row>
            )}
        </div>
    );
};
