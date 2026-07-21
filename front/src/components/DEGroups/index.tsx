import { useGetEliminationParticipantsPairQuery } from "@/services/Tournament/tournament";
import { Col, Row, Spin, Typography } from "antd";
import { SeriesCard } from "@/components/SeriesCard";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { SERIES_STATUSES } from "@/shared/types/models/Tournament";
import { MatchPlayerTeamModel } from "@/shared/types/models/Series";

export interface EliminationGroupsProps {
    tournamentId: string;
    stageId: string;
    deStageId?: string;
    roundId: string;
    seStageId?: string;
}

export const EliminationGroups = ({
    tournamentId,
    stageId,
    deStageId,
    roundId,
    seStageId,
}: EliminationGroupsProps) => {
    const { currentData, isLoading } = useGetEliminationParticipantsPairQuery({
        tournamentId,
        stageId,
        deStageId,
        seStageId,
        roundId,
        stageType: deStageId ? "de" : "se",
    });
    const pathname = usePathname();
    const seriesPage = (seriesId: string) => `${pathname}/series/${seriesId}`;

    return (
        <Row gutter={[16, 16]}>
            {isLoading && <Spin style={{ width: "100%" }} />}
            {currentData &&
                currentData.series.map((group) => (
                    <Col
                        key={group.id}
                        xs={24}
                        md={currentData.series.length === 1 ? 24 : 12}
                    >
                        <div style={{ padding: "15px" }}>
                            <Typography.Title
                                style={{
                                    fontSize: 16,
                                    fontWeight: 400,
                                    textAlign: "center",
                                    marginBottom: 0,
                                }}
                            >
                                {group.short_id}
                            </Typography.Title>
                        </div>
                        <Row gutter={[16, 16]}>
                            <Col
                                xs={24}
                                sm={24}
                                md={24}
                                lg={currentData.series.length === 1 ? 12 : 24}
                                key={group.id}
                            >
                                <Link href={seriesPage(group.series.id)}>
                                    <SeriesCard
                                        type={"series"}
                                        homeTeam={group.series.participant1?.team as unknown as MatchPlayerTeamModel}
                                        guestTeam={group.series.participant2?.team as unknown as MatchPlayerTeamModel}
                                        homePlayerAccount={group.series.participant1?.account ?? group.series.gamer1}
                                        guestPlayerAccount={group.series.participant2?.account ?? group.series.gamer2}
                                        status={
                                            group.status as keyof typeof SERIES_STATUSES
                                        }
                                        homePlayerMatchResult={
                                            group.series.gamer1_score
                                        }
                                        guestPlayerMatchResult={
                                            group.series.gamer2_score
                                        }
                                        matches={group.series.matches}
                                        showInitials={true}
                                    />
                                </Link>
                            </Col>
                        </Row>
                    </Col>
                ))}
        </Row>
    );
};
