"use client";

import { Col, Row, Skeleton, Typography } from "antd";
import { useGetTournamentByIdQuery } from "@/services/Tournament/tournament";
import { TournamentPlaying } from "@/components/TournamentPlaying";

const PlayingPage = ({ params }: { params: { tournamentId: string } }) => {

    const { currentData: tournament, isLoading } = useGetTournamentByIdQuery({ id: params.tournamentId });

    return (
        <>
            {isLoading && <Skeleton active />}
            {tournament &&
                <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
                    {/* <Col span={24} style={{ textAlign: 'center' }}>
                        <Typography.Title level={3}>Управление турниром &#171;{tournament.name}&#187;</Typography.Title>
                    </Col> */}
                    <Col span={24}>
                        <TournamentPlaying tournamentId={params.tournamentId} />
                    </Col>
                </Row>
            }
        </>
    );
};

export default PlayingPage;