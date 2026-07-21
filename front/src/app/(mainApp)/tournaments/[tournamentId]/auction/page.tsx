"use client";

import { useState, useEffect } from "react";
import {
    Button,
    Input,
    Layout,
    Typography,
    Spin,
    Alert,
    Space,
    Card,
} from "antd";
import {
    SearchOutlined,
    PlayCircleOutlined,
    LeftOutlined,
    ArrowsAltOutlined,
    ShrinkOutlined,
} from "@ant-design/icons";
import { useParams, useRouter } from "next/navigation";
import { useAuctionWebSocket } from "@/shared/hooks/useAuctionWebSocket";
import { useStartAuctionMutation } from "@/services/Auction/auction";
import { useTournamentRole } from "@/shared/hooks/useTournamentRole";
import { AuctionLotComponent } from "@/components/AuctionLot";
import { useGetCurrentUserQuery } from "@/services/User/user";
import s from "./page.module.scss";
import type { AuctionData, AuctionLot } from "@/shared/types/models/Auction";

const { Content } = Layout;
const { Title, Text } = Typography;

export default function AuctionPage() {
    const { tournamentId } = useParams();
    const [isExpanded, setIsExpanded] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [startAuction, { isLoading: isStartingAuction }] =
        useStartAuctionMutation();
    const { currentData: user } = useGetCurrentUserQuery();

    const { isTournamentModerator, isTournamentOrganizer } = useTournamentRole(
        tournamentId as string,
    );

    const { auctionData, isConnected, isStarted, makeBet, error, sendInit } =
        useAuctionWebSocket(tournamentId as string);

    useEffect(() => {
        if (!isConnected || !isStarted) return;
        const interval = setInterval(() => {
            sendInit();
        }, 4000);
        return () => clearInterval(interval);
    }, [isConnected, isStarted, sendInit]);

    const canStartAuction = isTournamentModerator || isTournamentOrganizer;

    const handleStartAuction = async () => {
        try {
            await startAuction({
                tournamentId: tournamentId as string,
            }).unwrap();
            sendInit();
        } catch (error) {
            console.error("Failed to start auction:", error);
        }
    };

    const getUserCurrentTeamBet = (teamId: string) => {
        if (!auctionData) return undefined;
        const lot = auctionData.lots.find(
            (lot: AuctionLot) => lot.team.id === teamId,
        );
        if (!lot || !lot.max_bet) return undefined;
        if (lot.max_bet.participant.account.user.id === user?.id) {
            return lot.max_bet.bet;
        }
        return undefined;
    };

    const isUserCurrentMaxBidderOnAnyTeam = () => {
        if (!auctionData || !user) return false;

        return auctionData.lots.some(
            (lot: AuctionLot) =>
                lot.max_bet?.participant.account.user.id === user.id,
        );
    };

    const filteredLots =
        auctionData?.lots.filter(
            (lot: AuctionLot) =>
                lot.team.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                lot.team.game.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()),
        ) || [];

    const router = useRouter();

    if (error) {
        return (
            <Content className={s.content}>
                <Alert
                    message="Ошибка подключения"
                    description={error}
                    type="error"
                    showIcon
                />
            </Content>
        );
    }

    if (!isConnected || isStarted === null) {
        return (
            <Content className={s.content}>
                <div className={s.loading}>
                    <Spin size="large" />
                    <Text>Подключение к аукциону...</Text>
                </div>
            </Content>
        );
    }

    if (isStarted === false) {
        return (
            <Content className={s.content}>
                <div className={s.notStarted}>
                    <Card className={s.startCard}>
                        <Space direction="vertical" size="large" align="center">
                            <Title level={3}>Аукцион не начат</Title>
                            <Text type="secondary">
                                Аукцион для данного турнира еще не начался.
                            </Text>
                            {canStartAuction && (
                                <Button
                                    type="primary"
                                    size="large"
                                    icon={<PlayCircleOutlined />}
                                    onClick={handleStartAuction}
                                    loading={isStartingAuction}
                                >
                                    Начать аукцион
                                </Button>
                            )}
                        </Space>
                    </Card>
                </div>
            </Content>
        );
    }

    return (
        <Content className={s.content}>
            <div className={s.auctionContainer} style={{ maxWidth: isExpanded ? "100%" : "1400px" }}>
                <div className={s.headerRow}>
                    <div className={s.headerLeft}>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 12,
                            }}
                        >
                            <Button
                                type="text"
                                icon={<LeftOutlined style={{ fontSize: 20 }} />}
                                onClick={() =>
                                    router.push(`/tournaments/${tournamentId}`)
                                }
                                style={{ marginRight: 8 }}
                            />
                            <Title style={{ margin: 0 }} level={2}>
                                Аукцион команд <Button type="text" icon={isExpanded ? <ShrinkOutlined /> : <ArrowsAltOutlined />} onClick={() => setIsExpanded(!isExpanded)} />
                            </Title>
                        </div>
                        {auctionData && (
                            <div className={s.infoGrid}>
                                <div className={s.infoCard}>
                                    <div className={s.infoIcon}>
                                        <div className={s.iconMinBet}>₽</div>
                                    </div>
                                    <div className={s.infoContent}>
                                        <Text className={s.infoLabel}>
                                            Минимальная стоимость
                                        </Text>
                                        <Text className={s.infoValue}>
                                            {auctionData.min_bet}
                                        </Text>
                                    </div>
                                </div>
                                <div className={s.infoCard}>
                                    <div className={s.infoIcon}>
                                        <div className={s.iconMaxBet}>₽</div>
                                    </div>
                                    <div className={s.infoContent}>
                                        <Text className={s.infoLabel}>
                                            Максимальная ставка за один раз
                                        </Text>
                                        <Text className={s.infoValue}>
                                            {auctionData.max_bet}
                                        </Text>
                                    </div>
                                </div>
                                <div className={s.infoCard}>
                                    <div className={s.infoIcon}>
                                        <div className={s.iconBetStep}>+</div>
                                    </div>
                                    <div className={s.infoContent}>
                                        <Text className={s.infoLabel}>
                                            Шаг ставки
                                        </Text>
                                        <Text className={s.infoValue}>
                                            {auctionData.bet_step}
                                        </Text>
                                    </div>
                                </div>
                                <div className={s.infoCard}>
                                    <div className={s.infoIcon}>
                                        <div className={s.iconDuration}>⏱</div>
                                    </div>
                                    <div className={s.infoContent}>
                                        <Text className={s.infoLabel}>
                                            Продолжительность
                                        </Text>
                                        <Text className={s.infoValue}>
                                            {Math.floor(
                                                auctionData.bet_duration_seconds /
                                                    60,
                                            )}{" "}
                                            мин
                                        </Text>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className={s.headerRight}>
                        <div className={s.searchContainer}>
                            <Input
                                placeholder="Поиск команд..."
                                prefix={<SearchOutlined />}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={s.searchInput}
                            />
                        </div>
                    </div>
                </div>

                <div className={s.lotsContainer}>
                    {filteredLots.map((lot: AuctionLot) => (
                        <AuctionLotComponent
                            key={lot.team.id}
                            lot={lot}
                            minBet={auctionData!.min_bet}
                            maxBet={auctionData!.max_bet}
                            betStep={auctionData!.bet_step}
                            onMakeBet={makeBet}
                            currentUserBet={getUserCurrentTeamBet(lot.team.id)}
                            isUserCurrentMaxBidder={isUserCurrentMaxBidderOnAnyTeam()}
                        />
                    ))}
                </div>

                {filteredLots.length === 0 && searchQuery && (
                    <div className={s.noResults}>
                        <Text type="secondary">
                            Команды не найдены по запросу "{searchQuery}"
                        </Text>
                    </div>
                )}
            </div>
        </Content>
    );
}
