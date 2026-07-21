import { Col, Row, Skeleton, Typography } from "antd";
import { SeriesCard } from "@/components/SeriesCard";
import { useParams } from "next/navigation";
import { useGetMatchesByIdQuery } from "@/services/Series/series";
import { useMemo } from "react";

export const SeriesList = () => {
    const params = useParams<{ tournamentId: string; seriesId: string }>();

    const { currentData: matches, isLoading } = useGetMatchesByIdQuery({
        tournamentId: params.tournamentId,
        seriesId: params.seriesId,
    });

    const visibleIndex = useMemo(() => {
        if (matches) {
            return matches.findIndex((el, index, array) => {
                if (el?.status === 1 && index > 0) {
                    if (array[index - 1]?.status === 1) {
                        return true;
                    }
                    return false;
                }
                return false;
            });
        }
        return 0;
    }, [matches]);

    if (isLoading) {
        return <Skeleton active />;
    }

    return (
        <Row gutter={[16, 16]} data-comp="series-list">
            {matches &&
                visibleIndex === -1 &&
                matches.map((match, index) => (
                    <Col xs={24}>
                        <SeriesCard
                            disabled={false}
                            isScoreEditable={false}
                            type={"match"}
                            status={match.status}
                            href={`/tournaments/${params?.tournamentId}/series/${params?.seriesId}/match/${match.id}`}
                            homePlayerAccount={match.home_player_account}
                            guestPlayerAccount={match.guest_player_account}
                            homeTeam={match.home_player_team}
                            guestTeam={match.guest_player_team}
                            homePlayerMatchResult={
                                match.home_player_match_result
                            }
                            guestPlayerMatchResult={
                                match.guest_player_match_result
                            }
                            index={index}
                        />
                    </Col>
                ))}
            {matches &&
                visibleIndex !== -1 &&
                matches.slice(0, visibleIndex).map((match, index) => (
                    <Col xs={24}>
                        <SeriesCard
                            disabled={false}
                            isScoreEditable={false}
                            type={"match"}
                            status={match.status}
                            href={`/tournaments/${params?.tournamentId}/series/${params?.seriesId}/match/${match.id}`}
                            homePlayerAccount={match.home_player_account}
                            guestPlayerAccount={match.guest_player_account}
                            homeTeam={match.home_player_team}
                            guestTeam={match.guest_player_team}
                            homePlayerMatchResult={
                                match.home_player_match_result
                            }
                            guestPlayerMatchResult={
                                match.guest_player_match_result
                            }
                            index={index}
                        />
                    </Col>
                ))}
            {matches && visibleIndex !== -1 && (
                <Col xs={24}>
                    <div style={{ position: "relative" }}>
                        <div style={{ filter: "blur(10px) brightness(70%)" }}>
                            <Row gutter={[16, 16]}>
                                {matches
                                    .slice(visibleIndex)
                                    .map((match, index) => (
                                        <Col xs={24}>
                                            <SeriesCard
                                                disabled={false}
                                                isScoreEditable={false}
                                                type={"match"}
                                                index={index}
                                                status={match.status}
                                                href={`/tournaments/${params?.tournamentId}/series/${params?.seriesId}/match/${match.id}`}
                                                homePlayerAccount={
                                                    match.home_player_account
                                                }
                                                guestPlayerAccount={
                                                    match.guest_player_account
                                                }
                                                homeTeam={
                                                    match.home_player_team
                                                }
                                                guestTeam={
                                                    match.guest_player_team
                                                }
                                                homePlayerMatchResult={
                                                    match.home_player_match_result
                                                }
                                                guestPlayerMatchResult={
                                                    match.guest_player_match_result
                                                }
                                            />
                                        </Col>
                                    ))}
                            </Row>
                        </div>
                        <Typography.Title
                            level={5}
                            style={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                textAlign: "center",
                            }}
                        >
                            Внесите результат в предыдущую игру, чтобы перейти к
                            следующей
                        </Typography.Title>
                    </div>
                </Col>
            )}
        </Row>
    );
};
