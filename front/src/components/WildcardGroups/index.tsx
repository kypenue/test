import { useGetWildcardParticipantsPairQuery } from "@/services/Tournament/tournament";
import { Col, Row, Spin } from "antd";
import { SeriesCard } from "@/components/SeriesCard";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { MatchPlayerTeamModel } from "@/shared/types/models/Series";

export interface WildcardGroupsProps {
    tournamentId: string;
    stageId: string;
    roundId: string;
    wildcardStageId: string;
}

export const WildcardGroups = ({
    tournamentId,
    stageId,
    wildcardStageId,
    roundId,
}: WildcardGroupsProps) => {
    const { currentData, isLoading } = useGetWildcardParticipantsPairQuery({
        tournamentId,
        stageId,
        wildcardStageId,
        roundId,
    });
    const pathname = usePathname();
    const seriesPage = (seriesId: string) => `${pathname}/series/${seriesId}`;

    return (
        <Row gutter={[16, 16]}>
            {isLoading && <Spin style={{ width: "100%" }} />}
            {currentData && (
                <Row gutter={[16, 16]} style={{ padding: "0 16px" }}>
                    {currentData.series.map((item, index) => (
                        <Col xs={24} sm={24} md={24} lg={12} key={item.id}>
                            <Link href={seriesPage(item.series.id)}>
                                <SeriesCard
                                    type={"series"}
                                    homeTeam={item.series.participant1?.team as unknown as MatchPlayerTeamModel}
                                    guestTeam={item.series.participant2?.team as unknown as MatchPlayerTeamModel}
                                    homePlayerAccount={item.series.participant1?.account ?? item.series.gamer1}
                                    guestPlayerAccount={item.series.participant2?.account ?? item.series.gamer2}
                                    homePlayerMatchResult={
                                        item.series.gamer1_score
                                    }
                                    guestPlayerMatchResult={
                                        item.series.gamer2_score
                                    }
                                    matches={item.series.matches}
                                    showInitials={true}
                                />
                            </Link>
                        </Col>
                    ))}
                </Row>
            )}
        </Row>
    );
};
