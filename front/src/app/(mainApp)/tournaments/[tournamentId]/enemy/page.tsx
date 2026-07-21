"use client";

import { Col, Row, Skeleton } from "antd";
import { useSearchParams } from "next/navigation";
import { useGetTournamentByIdQuery } from "@/services/Tournament/tournament";
import { TournamentPlayingElimination } from "../../../../../components/TournamentPlayingElimination";
import { TournamentPlayingSwiss } from "@/components/TournamentPlayingSwiss";

const EnemyPage = ({ params }: { params: { tournamentId: string } }) => {
    const searchParams = useSearchParams();

    const stageType = searchParams.get("type");
    const { currentData: tournament, isLoading } = useGetTournamentByIdQuery({
        id: params.tournamentId,
    });

    return (
        <>
            {isLoading && <Skeleton active />}
            {tournament && (
                <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
                    <Col span={24}>
                        {stageType === "swiss" ? (
                            <TournamentPlayingSwiss
                                tournamentId={params.tournamentId}
                            />
                        ) : (
                            <TournamentPlayingElimination
                                tournamentId={params.tournamentId}
                            />
                        )}
                    </Col>
                </Row>
            )}
        </>
    );
};

export default EnemyPage;
