"use client";
import { Button, Col, Row, Typography } from "antd";
import { useRouter } from "next/navigation";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { SeriesList } from "@/components/SeriesList";
import { useGetTournamentByIdQuery } from "@/services/Tournament/tournament";
import { ComplaintsSeriesList } from "@/components/Complaints/ComplaintsSeriesList";
import { useRoleInMatch } from "@/shared/hooks/useRoleInSeries";
import { ParticipantsCard } from "@/components/ParticipantsCard";
import { PreviousOpponentMatches } from "@/components/PreviousOpponentMatches";

export interface SeriesPageProps {
    params: { tournamentId: string; seriesId: string };
}

const SeriesPage = ({ params }: SeriesPageProps) => {
    const router = useRouter();

    const { currentData } = useGetTournamentByIdQuery({
        id: params?.tournamentId,
    });

    const { isAdmin } = useRoleInMatch({});

    const handleBack = () => {
        router.back();
    };
    return (
        <Row gutter={[16, 16]}>
            <Col span={24}>
                <Row justify={"space-between"}>
                    <Col>
                        <Button
                            type={"link"}
                            onClick={handleBack}
                            icon={<ArrowLeftOutlined />}
                        >
                            Назад
                        </Button>
                    </Col>
                    <Col>
                        <Typography.Title level={3}>
                            {currentData?.name}
                        </Typography.Title>
                    </Col>
                    <Col>&nbsp;</Col>
                </Row>
            </Col>
            <Col span={24}>
                <Row gutter={[16, 16]}>
                    <Col xs={24} md={16}>
                        <SeriesList />
                    </Col>
                    <Col xs={24} md={8}>
                        <Row gutter={[16, 16]}>
                            <Col span={24}>
                                <ParticipantsCard params={params} />
                            </Col>
                            <Col span={24}>
                                <PreviousOpponentMatches params={params} />
                            </Col>
                            <Col span={24}>
                                <ComplaintsSeriesList
                                    params={params}
                                    isAdmin={isAdmin}
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Col>
            {/* <ContentCard title={"Оцените соперника"}>
                <RateCompetitor />
            </ContentCard> */}
        </Row>
    );
};
export default SeriesPage;
