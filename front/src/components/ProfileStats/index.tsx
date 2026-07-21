import { useGetGamerStatsQuery } from "@/services/Games/games";
import { skipToken } from "@reduxjs/toolkit/query";
import { Col, Empty, Flex, Row } from "antd";
import { StatCard } from "./StatCard";
import { GameAccountsDropDown } from "@/components/GameAccountsDropDown";
import { useState } from "react";
import { ContentCard } from "@/components/ContentCard";

export const ProfileStats = () => {
    const [accountId, setAccountId] = useState<string | null>(null);

    const { data, isFetching, isUninitialized } = useGetGamerStatsQuery(
        accountId ?? skipToken,
    );

    return (
        <ContentCard>
            <Row align={"middle"} gutter={[24, 24]}>
                <Col span={24}>
                    <Flex vertical gap={16}>
                        <Row>
                            <Col span={24} sm={6}>
                                <GameAccountsDropDown
                                    setAccount={setAccountId}
                                    accountId={accountId}
                                />
                            </Col>
                        </Row>
                        {accountId ? (
                            <Row gutter={[8, 8]}>
                                <Col md={7} span={24}>
                                    <Row gutter={[8, 8]}>
                                        <Col
                                            span={24}
                                            xs={{ order: 4 }}
                                            md={{ order: 0 }}
                                        >
                                            <StatCard
                                                title={"Количество игр"}
                                                value={data?.matches_count}
                                                style={{ borderRadius: "10px" }}
                                                isLoading={
                                                    !isUninitialized &&
                                                    isFetching
                                                }
                                            />
                                        </Col>
                                        <Col
                                            xs={24}
                                            sm={12}
                                            md={24}
                                            style={{ display: "flex" }}
                                        >
                                            <StatCard
                                                size={"large"}
                                                title={"Крупнейшая победа"}
                                                value={data?.biggest_win ?? "-"}
                                                wrap
                                                position={"center"}
                                                isLoading={
                                                    !isUninitialized &&
                                                    isFetching
                                                }
                                            />
                                        </Col>
                                        <Col xs={24} sm={12} md={24}>
                                            <StatCard
                                                size={"large"}
                                                title={"Крупнейшее поражение"}
                                                value={
                                                    data?.biggest_loss ?? "-"
                                                }
                                                wrap
                                                position={"center"}
                                                isLoading={
                                                    !isUninitialized &&
                                                    isFetching
                                                }
                                            />
                                        </Col>
                                        <Col span={24}>
                                            <StatCard
                                                title={"Сухие игры в (%)"}
                                                value={
                                                    data
                                                        ? `${data.clean_sheets_percent}%`
                                                        : undefined
                                                }
                                                isLoading={
                                                    !isUninitialized &&
                                                    isFetching
                                                }
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                                <Col md={17} span={24}>
                                    <Row gutter={[8, 8]}>
                                        <Col flex={1}>
                                            <StatCard
                                                size={"large"}
                                                title={"Победы"}
                                                value={data?.wins}
                                                isWLD
                                                position={"center"}
                                                isLoading={
                                                    !isUninitialized &&
                                                    isFetching
                                                }
                                            />
                                        </Col>
                                        <Col flex={1}>
                                            <StatCard
                                                size={"large"}
                                                title={"Поражения"}
                                                value={data?.losses}
                                                isWLD
                                                position={"center"}
                                                isLoading={
                                                    !isUninitialized &&
                                                    isFetching
                                                }
                                            />
                                        </Col>
                                        <Col flex={1}>
                                            <StatCard
                                                size={"large"}
                                                title={"Ничьи"}
                                                value={data?.draws}
                                                isWLD
                                                position={"center"}
                                                isLoading={
                                                    !isUninitialized &&
                                                    isFetching
                                                }
                                            />
                                        </Col>
                                        <Col span={24}>
                                            <StatCard
                                                size={"large"}
                                                title={"Победы в (%)"}
                                                value={
                                                    data
                                                        ? `${data.wins_percent}%`
                                                        : undefined
                                                }
                                                position={"center"}
                                                isLoading={
                                                    !isUninitialized &&
                                                    isFetching
                                                }
                                                isWins
                                            />
                                        </Col>
                                        <Col
                                            sm={12}
                                            span={24}
                                            style={{ display: "flex" }}
                                        >
                                            <StatCard
                                                title={"Кол-во забитых очков"}
                                                value={data?.goals_scored}
                                                style={{ paddingBlock: "8px" }}
                                                isLoading={
                                                    !isUninitialized &&
                                                    isFetching
                                                }
                                            />
                                        </Col>
                                        <Col sm={12} span={24}>
                                            <StatCard
                                                title={
                                                    "Кол-во пропущенных очков"
                                                }
                                                value={data?.goals_conceded}
                                                style={{ paddingBlock: "8px" }}
                                                isLoading={
                                                    !isUninitialized &&
                                                    isFetching
                                                }
                                            />
                                        </Col>
                                        <Col sm={12} span={24}>
                                            <StatCard
                                                title={
                                                    "Кол-во очков за игру (AVG)"
                                                }
                                                value={data?.avg_goals_scored}
                                                size={"large"}
                                                position={"center"}
                                                isLoading={
                                                    !isUninitialized &&
                                                    isFetching
                                                }
                                            />
                                        </Col>
                                        <Col sm={12} span={24}>
                                            <StatCard
                                                title={
                                                    "Кол-во пропущенных (AVG)"
                                                }
                                                value={data?.avg_goals_conceded}
                                                size={"large"}
                                                position={"center"}
                                                isLoading={
                                                    !isUninitialized &&
                                                    isFetching
                                                }
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        ) : (
                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description="Необходимо выбрать аккаунт"
                            />
                        )}
                    </Flex>
                </Col>
            </Row>
        </ContentCard>
    );
};
