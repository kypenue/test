import { useGetParticipantsPairQuery } from "@/services/Tournament/tournament";
import s from "@/components/TournamentPlayingSwiss/style.module.scss";
import { Col, Row, Spin, Typography } from "antd";
import { ContentCardToss } from "@/components/ContentCardToss";
import { SeriesCard } from "@/components/SeriesCard";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { getDeclinations } from "@/shared/lib/getDiclinations";

export interface SwissGroupsProps {
    tournamentId: string;
    stageId: string;
    swissStageId: string;
    roundId: string;
    status?: string;
    stageType: string;
}

export const SwissGroups = ({
    tournamentId,
    stageId,
    swissStageId,
    roundId,
    status,
    stageType,
}: SwissGroupsProps) => {
    const { currentData, isLoading } = useGetParticipantsPairQuery({
        tournamentId,
        stageId,
        swissStageId,
        roundId,
        status,
        stageType,
    });
    const pathname = usePathname();
    const seriesPage = (seriesId: string) => `${pathname}/series/${seriesId}`;

    return (
        <Row gutter={[16, 16]}>
            {isLoading && <Spin style={{ width: "100%" }} />}
            {currentData &&
                currentData.series_groups
                    .filter((groups) => !!groups.series.length)
                    .map((group) => (
                        <Col
                            key={group.id}
                            xs={24}
                            md={
                                currentData.series_groups.length === 1 ? 24 : 12
                            }
                        >
                            <ContentCardToss
                                color="#0E0029"
                                style={{
                                    maxHeight: "70vh",
                                    overflowY: "scroll",
                                }}
                                title={
                                    <div className={s.cardTitle}>
                                        <Typography.Title
                                            style={{
                                                fontSize: 16,
                                                fontWeight: 400,
                                                textAlign: "center",
                                                marginBottom: 0,
                                            }}
                                        >
                                            Группа W{group.wins_number} L
                                            {group.loses_number}
                                        </Typography.Title>
                                        <Typography.Text
                                            style={{
                                                textAlign: "center",
                                                display: "block",
                                            }}
                                            type={"secondary"}
                                        >
                                            {getDeclinations({
                                                count: group.series.length,
                                                one: "серия",
                                                few: "серии",
                                                many: "серий",
                                            })}
                                        </Typography.Text>
                                    </div>
                                }
                            >
                                <Row gutter={[16, 16]}>
                                    {group.series.map((item, index) => (
                                        <Col
                                            xs={24}
                                            sm={24}
                                            md={24}
                                            lg={
                                                currentData.series_groups
                                                    .length === 1
                                                    ? 12
                                                    : 24
                                            }
                                            key={item.id}
                                        >
                                            <Link
                                                href={seriesPage(
                                                    item.series.id,
                                                )}
                                                style={{
                                                    display: "flex",
                                                    height: "100%",
                                                    width: "100%",
                                                }}
                                            >
                                                <SeriesCard
                                                    type={"series"}
                                                    homeTeam={null}
                                                    guestTeam={null}
                                                    homePlayerAccount={
                                                        item.series.gamer1
                                                    }
                                                    guestPlayerAccount={
                                                        item.series.gamer2
                                                    }
                                                    homePlayerMatchResult={
                                                        item.series.gamer1_score
                                                    }
                                                    guestPlayerMatchResult={
                                                        item.series.gamer2_score
                                                    }
                                                    matches={
                                                        item.series.matches
                                                    }
                                                    styles={{ flexGrow: "1" }}
                                                    showInitials
                                                />
                                            </Link>
                                        </Col>
                                    ))}
                                </Row>
                            </ContentCardToss>
                        </Col>
                    ))}
        </Row>
    );
};
