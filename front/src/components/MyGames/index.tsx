import { Col, Divider, Empty, Row, Skeleton, Typography } from "antd";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

import { useGetMySeriesQuery } from "@/services/Series/series";

import { SeriesCard } from "@/components/SeriesCard";
import { InnerSeries, SERIES_STATUSES } from "@/shared/types/models/Tournament";

export const MyGames = () => {
    const { tournamentId } = useParams<{ tournamentId: string }>();
    const pathname = usePathname();
    const seriesPage = (seriesId: string) => `${pathname}/series/${seriesId}`;

    const { currentData: series, isLoading } = useGetMySeriesQuery({
        tournamentId,
        order_by: "-created_at",
    });

    if (isLoading) {
        return <Skeleton active />;
    }

    const isActiveSeries = (series: InnerSeries) => {
        return series.status === SERIES_STATUSES.PLAYING;
    };

    const isInactiveSeries = (series: InnerSeries) => {
        return series.status === SERIES_STATUSES.PLAYED;
    };

    const activeSeries = series ? series.payload.filter(isActiveSeries) : [];

    const inActiveSeries = series
        ? series.payload.filter(isInactiveSeries)
        : [];

    return (
        <Row gutter={[32, 16]}>
            <Col span={24}>
                <Typography.Title level={3}>Мои игры </Typography.Title>
            </Col>
            <Col span={24}>
                <Row justify={"center"} gutter={[16, 16]}>
                    {!!activeSeries.length &&
                        activeSeries.map((data) => (
                            <Col span={24} key={data.id}>
                                <Link href={seriesPage(data.id)}>
                                    <SeriesCard
                                        homePlayerAccount={data.gamer1}
                                        guestPlayerAccount={data.gamer2}
                                        homeTeam={null}
                                        guestTeam={null}
                                        homePlayerMatchResult={
                                            data.gamer1_score
                                        }
                                        guestPlayerMatchResult={
                                            data.gamer2_score
                                        }
                                        type={"series"}
                                        live={true}
                                        showInitials
                                    />
                                </Link>
                            </Col>
                        ))}
                    {!activeSeries.length && (
                        <Empty
                            imageStyle={{ height: "fit-content" }}
                            image={<Typography.Title>🍃</Typography.Title>}
                            description={"Все игры сыграны"}
                        />
                    )}
                </Row>
            </Col>
            <Divider>Прошедшие</Divider>
            <Col span={24}>
                <Row
                    justify={"center"}
                    style={{ opacity: 0.7 }}
                    gutter={[16, 16]}
                >
                    {!!inActiveSeries.length &&
                        inActiveSeries.map((data, index) => (
                            <Col span={24} key={data.id}>
                                <Link href={seriesPage(data.id)}>
                                    <SeriesCard
                                        homePlayerAccount={data.gamer1}
                                        guestPlayerAccount={data.gamer2}
                                        homeTeam={null}
                                        guestTeam={null}
                                        homePlayerMatchResult={
                                            data.gamer1_score
                                        }
                                        guestPlayerMatchResult={
                                            data.gamer2_score
                                        }
                                        matches={data.matches}
                                        type={"series"}
                                        showInitials
                                    />
                                </Link>
                            </Col>
                        ))}
                    {!inActiveSeries.length && (
                        <Empty
                            imageStyle={{ height: "fit-content" }}
                            image={<Typography.Title>🍃</Typography.Title>}
                            description={"Прошедших игр нет"}
                        />
                    )}
                </Row>
            </Col>
        </Row>
    );
};
