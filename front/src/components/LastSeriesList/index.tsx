import { Col, Row } from "antd";
import { useGetLastTournamentSeriesQuery } from "@/services/Tournament/tournament";
import { SeriesCardSmall } from "@/components/SeriesCard/SeriesCardSmall";
import s from "./LastSeriesList.module.scss";

export const LastSeriesList = () => {
    const { currentData } = useGetLastTournamentSeriesQuery({
        per_page: 9,
        status: "PLAYED",
    });
    console.log(currentData);
    return (
        <>
            {currentData?.payload && (
                <>
                    <p className={s.title}>Последние игры</p>

                    <Row gutter={[8, 8]}>
                        {currentData?.payload.map((item) => (
                            <Col key={item.id} xs={24} sm={12} md={8}>
                                <SeriesCardSmall
                                    href={`/tournaments/${item.tournament_id}/series/${item.id}`}
                                    type={"series"}
                                    homeTeam={null}
                                    guestTeam={null}
                                    homePlayerAccount={{
                                        ...item.participant1.account,
                                        //@ts-ignore
                                        team: item.participant1.team,
                                    }}
                                    guestPlayerAccount={{
                                        ...item.participant2.account,
                                        //@ts-ignore
                                        team: item.participant2.team,
                                    }}
                                    homePlayerMatchResult={item.gamer1_score}
                                    guestPlayerMatchResult={item.gamer2_score}
                                    isSmall={true}
                                    updatedAt={item.updated_at}
                                    matches={item.matches}
                                />
                            </Col>
                        ))}
                    </Row>
                </>
            )}
        </>
    );
};
