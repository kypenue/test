import { Button, Col, Empty, Input, Modal, Pagination, Row, Spin } from "antd";
import {
    useDeleteTournamentTeamMutation,
    useGetTournamentTeamsQuery,
} from "@/services/Teams";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import { TeamItem } from "@/components/ProfileTeams/ProfileTeamsList/TeamItem";
import { SearchOutlined } from "@ant-design/icons";
import { AvailableTeamsList } from "./AvailableTeamsList";
import { ProfileTeam } from "@/services/Teams/teams.model";

export const TeamsList = () => {
    const params = useParams<{ tournamentId: string }>();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchValue, setSearchValue] = useState("");
    const [debouncedSearch] = useDebounceValue(searchValue, 500);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { currentData: tournamentTeams, isLoading } = useGetTournamentTeamsQuery({
        tournament_id: Number(params.tournamentId),
        page: currentPage,
        per_page: pageSize,
        ...(debouncedSearch && { search: debouncedSearch }),
    });

    const [deleteTeam] = useDeleteTournamentTeamMutation();


    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
        setCurrentPage(1);
    };

    const handlePageChange = (page: number, size?: number) => {
        setCurrentPage(page);
        if (size) {
            setPageSize(size);
        }
    };

    const handleAddTeamsClick = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleTeamAdded = () => {
        setIsModalOpen(false);
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
                <Col xs={24} md={18}>
                    <Input
                        placeholder="Поиск команд по названию"
                        value={searchValue}
                        onChange={handleSearchChange}
                        suffix={<SearchOutlined />}
                        size="large"
                        allowClear
                    />
                </Col>
                <Col xs={24} md={6}>
                    <Button
                        type="primary"
                        size="large"
                        style={{ width: "100%" }}
                        onClick={handleAddTeamsClick}
                    >
                        Добавить команды
                    </Button>
                </Col>
            </Row>
            {isLoading && (
                <div style={{ textAlign: "center", padding: "50px" }}>
                    <Spin size="large" />
                </div>
            )}

            {tournamentTeams && <>{tournamentTeams.payload.length > 0 ? (
                <Row gutter={[16, 16]}>
                    <Col xs={24}>
                        {tournamentTeams.payload.map((team) => (
                            <div key={team.id} style={{ marginBottom: 16 }}>
                                <TeamItem {...team} variant="copy" onDeleteTeam={handleDeleteTeam} />
                            </div>
                        ))}
                    </Col>
                </Row>
            ) : (
                <Empty
                    description={
                        debouncedSearch 
                            ? "Команды не найдены"
                            : "Нет команд в турнире"
                    }
                    style={{ marginTop: 40 }}
                />
            )}</>}

            {tournamentTeams && tournamentTeams.payload.length > 0 && (
                <Row justify="center" style={{ marginTop: 24 }}>
                    <Pagination
                        current={currentPage}
                        total={tournamentTeams.total_count}
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

            <Modal
                title="Добавить команды в турнир"
                open={isModalOpen}
                onCancel={handleModalClose}
                destroyOnClose
                width={800}
                footer={null}
            >
                <AvailableTeamsList />
            </Modal>
        </div>
    );
};
