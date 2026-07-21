import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Button, Input, Typography, Flex } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { AuctionLot } from "@/shared/types/models/Auction";
import { getStaticImage } from "@/shared/lib/getStaticImage";
import { useGetCurrentUserQuery } from "@/services/User/user";
import s from "./style.module.scss";

interface AuctionLotProps {
    lot: AuctionLot;
    minBet: number;
    maxBet: number;
    betStep: number;
    onMakeBet: (teamId: string, bet: number) => void;
    currentUserBet?: number;
    isUserCurrentMaxBidder?: boolean;
}

export const AuctionLotComponent = ({
    lot,
    minBet,
    betStep,
    onMakeBet,
    currentUserBet,
    isUserCurrentMaxBidder,
    maxBet,
}: AuctionLotProps) => {
    const [betAmount, setBetAmount] = useState<string>("");
    const [timeLeft, setTimeLeft] = useState(lot.seconds_left);
    const [glow, setGlow] = useState(false);
    const prevBetRef = useRef<number | undefined>(lot.max_bet?.bet);
    const { currentData: user } = useGetCurrentUserQuery();

    useEffect(() => {
        setTimeLeft(lot.seconds_left);
    }, [lot.seconds_left]);

    useEffect(() => {
        if (timeLeft <= 0) return;

        const interval = setInterval(() => {
            setTimeLeft((prev) => Math.max(0, prev - 1));
        }, 1000);

        return () => clearInterval(interval);
    }, [timeLeft]);

    // Glowing animation on bet change
    useEffect(() => {
        const currentBet = lot.max_bet?.bet;
        if (prevBetRef.current !== undefined && currentBet !== undefined && prevBetRef.current !== currentBet) {
            setGlow(true);
            const timeout = setTimeout(() => setGlow(false), 600);
            return () => clearTimeout(timeout);
        }
        prevBetRef.current = currentBet;
    }, [lot.max_bet?.bet]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
    };

    const getTimerClassName = useCallback(() => {
        if (timeLeft <= 10) return `${s.timeLeft} ${s.timeLeftRed}`;
        if (timeLeft <= 30) return `${s.timeLeft} ${s.timeLeftYellow}`;
        return s.timeLeft;
    }, [formatTime(timeLeft)]);

    const getInlineTimerClassName = useCallback(() => {
        if (timeLeft <= 10) return `${s.timeLeftInline} ${s.timeLeftRed}`;
        if (timeLeft <= 30) return `${s.timeLeftInline} ${s.timeLeftYellow}`;
        return s.timeLeftInline;
    }, [formatTime(timeLeft)]);

    const getMinBetAmount = () => {
        return lot.max_bet ? lot.max_bet.bet + betStep : minBet;
    };

    useEffect(() => {
        setBetAmount(getMinBetAmount()?.toString() || "");
    }, [getMinBetAmount()?.toString()]);

    const handleBetAmountChange = (value: string) => {
        const numValue = parseInt(value);
        if (!isNaN(numValue) && numValue >= 0) {
            setBetAmount(value);
        }
    };

    const handleMakeBet = () => {
        const betValue = parseInt(betAmount);
        if (betValue >= getMinBetAmount()) {
            onMakeBet(lot.team.id, betValue);
            setBetAmount("");
        }
    };

    const isCurrentUserBet =
        lot.max_bet?.participant.account.user.id === user?.id;
    const isTimeUp = timeLeft <= 0;
    const canBet = !isTimeUp && !isUserCurrentMaxBidder;

    const getCardClassName = () => {
        if (isTimeUp && !lot.max_bet) {
            return s.cardRed;
        }
        if (isCurrentUserBet) {
            return s.cardGreen;
        }
        if (canBet && !isTimeUp) {
            return s.cardYellow;
        }
        return s.cardDefault;
    };

    const getStatusText = () => {
        if (isTimeUp && !lot.max_bet) {
            return "Никто не выбрал";
        }
        if (isCurrentUserBet && !isTimeUp) {
            return "Ваша ставка лидирует";
        }
        if (isCurrentUserBet && isTimeUp) {
            return "Команда зафиксирована за вами";
        }
        if (isTimeUp) {
            return "Время вышло";
        }
        if (isUserCurrentMaxBidder && !isCurrentUserBet) {
            return "Вы уже выбрали другую команду";
        }
        if (isCurrentUserBet) {
            return "Дождитесь, пока вашу ставку перебьют";
        }
        return "";
    };

    const statusText = getStatusText();
    const hideTimer =
        statusText === "Команда зафиксирована за вами" ||
        statusText === "Время вышло" ||
        statusText === "Никто не выбрал";

    return (
        <div className={`${s.lotCard} ${getCardClassName()}`}>
            <div className={s.lotHeader}>
                <div className={s.teamInfo}>
                    <div className={s.teamHeader}>
                        <img
                            src={getStaticImage(lot.team.image?.object_key)}
                            alt={lot.team.name}
                            className={s.teamLogo}
                        />
                        <div className={s.teamDetails}>
                            <Typography.Text className={s.teamName}>
                                {lot.team.name}
                            </Typography.Text>
                        </div>
                    </div>
                </div>
                <div className={s.currentBet}>
                    <Typography.Text className={`${s.betAmount} ${glow ? s.betAmountGlow : ""}`}>
                        {lot.max_bet ? lot.max_bet.bet : minBet}
                    </Typography.Text>
                    {lot.max_bet && (
                        <Typography.Text className={s.betterName}>
                            {lot.max_bet.participant.account.user.name}{" "}
                            {lot.max_bet.participant.account.user.surname}
                        </Typography.Text>
                    )}
                </div>
            </div>

            {canBet && (
                <div className={s.bettingRow}>
                    <div className={s.bettingInterface}>
                        <Flex gap={8} align="center">
                            <Input
                                type="number"
                                value={betAmount}
                                defaultValue={getMinBetAmount()}
                                onChange={(e) =>
                                    handleBetAmountChange(e.target.value)
                                }
                                placeholder={getMinBetAmount().toString()}
                                className={s.betInput}
                                min={0}
                                max={maxBet + getMinBetAmount()}
                                step={betStep}
                            />
                            <Button
                                type="primary"
                                onClick={handleMakeBet}
                                disabled={
                                    !betAmount ||
                                    parseInt(betAmount) < getMinBetAmount()
                                }
                                style={{
                                    background:
                                        "linear-gradient(135deg, #6122E0 0%, #8B5CF6 100%)",
                                    border: "none",
                                    borderRadius: "8px",
                                    height: "40px",
                                }}
                            >
                                сохранить
                            </Button>
                        </Flex>
                    </div>
                    {!hideTimer && (
                        <div className={getInlineTimerClassName()}>
                            {formatTime(timeLeft)}
                        </div>
                    )}
                </div>
            )}

            {!canBet && !hideTimer && (
                <div className={getTimerClassName()}>
                    {formatTime(timeLeft)}
                </div>
            )}

            {statusText && (
                <div className={s.statusText}>
                    <Typography.Text className={s.status}>
                        {statusText}
                    </Typography.Text>
                </div>
            )}
        </div>
    );
};
