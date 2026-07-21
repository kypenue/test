"use client";
import { Col, Row, Skeleton } from "antd";
import { ContentCard } from "@/components/ContentCard";
import { ReglamentForm } from "@/components/ReglamentForm";
import { useGetTournamentByIdQuery } from "@/services/Tournament/tournament";

const ReglamentPage = ({ params }: { params: { tournamentId: string } }) => {
    const { currentData, isLoading } = useGetTournamentByIdQuery({ id: params.tournamentId });

    return (
        <div>
            {isLoading && <Skeleton active />}
            {!isLoading && !!currentData &&
                <ContentCard title={`Описание турнира “${currentData.name}”:`}>
                    <Row>
                        <Col span={24}>
                            <ReglamentForm tournamentId={Number(params.tournamentId)} />
                        </Col>
                    </Row>
                </ContentCard>
            }
        </div>
    );
};

export default ReglamentPage;