import { useMemo } from "react";
import {
    Avatar,
    Button,
    Col,
    Collapse,
    Flex,
    Row,
    Skeleton,
    message,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import {
    useGetCurrentTournamentUserSeriesQuery,
    useGetMatchesByIdQuery,
} from "@/services/Series/series";

import s from "./style.module.scss";
import Link from "next/link";
import { useGetProfilePhotoByIdQuery } from "@/services/User/user";
import { SeriesCardSmall } from "@/components/SeriesCard/SeriesCardSmall";
import { Participant } from "@/components/ParticipantsCard/Participant";
import { useSeriesVoting } from "@/shared/hooks/useSeriesVoting";

export interface ParticipantsCardProps {
    params: {
        tournamentId: string;
        seriesId: string;
    };
    isOpen?: boolean;
}

export const ParticipantsCard = ({
    params: { tournamentId, seriesId },
    isOpen,
}: ParticipantsCardProps) => {
    const { currentData: matches, isLoading } = useGetMatchesByIdQuery({
        tournamentId: tournamentId,
        seriesId: seriesId,
    });

    // Updated bet functionality
    const { placeBet, isBetButtonDisabled, bettedParticipantId, isBetAllowed, isBetExpired } =
        useSeriesVoting({ tournamentId, seriesId });

    const [messageApi, contextHolder] = message.useMessage();

    const handleBet = async (participantId: number | undefined) => {
        if (!participantId) return;

        try {
            await placeBet(participantId);
        } catch (error) {
            messageApi.error("Не удалось поддержать участника");
        }
    };

    const participants = useMemo(() => {
        if (matches) {
            return {
                guest: matches[0]?.guest_player_account,
                home: matches[0]?.home_player_account,
            };
        }
        return null;
    }, [matches]);

    const { currentData: photoHome } = useGetProfilePhotoByIdQuery(
        { id: participants?.home?.user.id?.toString() ?? "" },
        { skip: !participants || !participants?.home?.user?.id },
    );

    const { currentData: photoGuest } = useGetProfilePhotoByIdQuery(
        { id: participants?.guest?.user.id?.toString() ?? "" },
        { skip: !participants || !participants?.guest?.user?.id },
    );

    const { currentData: homeSeries, isLoading: isHomeSeriesLoading } =
        useGetCurrentTournamentUserSeriesQuery(
            {
                userId: participants?.home?.user.id?.toString() ?? "",
                tournamentId: tournamentId,
            },
            { skip: !participants || !participants?.home?.user?.id },
        );

    const { currentData: guestSeries, isLoading: isGuestSeriesLoading } =
        useGetCurrentTournamentUserSeriesQuery(
            {
                userId: participants?.guest?.user.id?.toString() ?? "",
                tournamentId: tournamentId,
            },
            { skip: !participants || !participants?.guest?.user?.id },
        );

    if (isLoading) {
        return <Skeleton active />;
    }

    return (
        <div className={s.card}>
            {contextHolder}
            <Collapse
                defaultActiveKey={isOpen ? ["1", "2"] : undefined}
                items={[
                    {
                        key: "1",
                        label: (
                            <Participant
                                userId={participants?.home?.user.id}
                                photo={photoHome}
                                login={participants?.home?.login}
                                onSupport={() => handleBet(participants?.home?.id)}
                                isSupported={
                                    bettedParticipantId ===
                                    participants?.home?.id
                                }
                                isButtonDisabled={isBetButtonDisabled(
                                    participants?.home?.id,
                                )}
                                isBetAllowed={isBetAllowed}
                           />
                        ),
                        children: (
                            <Row gutter={[8, 8]} className={s.matchesList}>
                                {homeSeries?.payload.map((series) => (
                                    <Col xs={24} key={series.id}>
                                        <SeriesCardSmall
                                            href={`/tournaments/${tournamentId}/series/${series?.id}`}
                                            type={"series"}
                                            homeTeam={null}
                                            guestTeam={null}
                                            homePlayerAccount={series.gamer1}
                                            guestPlayerAccount={series.gamer2}
                                            homePlayerMatchResult={
                                                series.gamer1_score
                                            }
                                            guestPlayerMatchResult={
                                                series.gamer2_score
                                            }
                                            matches={series.matches}
                                            isSmall={true}
                                            currentUserId={
                                                participants?.home?.user?.id
                                            }
                                            disabled={series.id === seriesId}
                                        />
                                    </Col>
                                ))}
                                {isHomeSeriesLoading && <Skeleton loading />}
                            </Row>
                        ),
                    },
                    {
                        key: "2",
                        label: (
                            <Participant
                                userId={participants?.guest?.user.id}
                                photo={photoGuest}
                                login={participants?.guest?.login}
                                onSupport={() =>
                                    handleBet(participants?.guest?.id)
                                }
                                isSupported={
                                    bettedParticipantId ===
                                    participants?.guest?.id
                                }
                                isButtonDisabled={isBetButtonDisabled(
                                    participants?.guest?.id,
                                )}
                                isBetAllowed={isBetAllowed}
                            />
                        ),
                        children: (
                            <Row gutter={[8, 8]} className={s.matchesList}>
                                {guestSeries?.payload.map((series) => (
                                    <Col xs={24} key={series.id}>
                                        <SeriesCardSmall
                                            href={`/tournaments/${tournamentId}/series/${series?.id}`}
                                            type={"series"}
                                            homeTeam={null}
                                            guestTeam={null}
                                            homePlayerAccount={series.gamer1}
                                            guestPlayerAccount={series.gamer2}
                                            homePlayerMatchResult={
                                                series.gamer1_score
                                            }
                                            guestPlayerMatchResult={
                                                series.gamer2_score
                                            }
                                            matches={series.matches}
                                            isSmall={true}
                                            currentUserId={
                                                participants?.guest?.user?.id
                                            }
                                            disabled={series.id === seriesId}
                                        />
                                    </Col>
                                ))}
                                {isGuestSeriesLoading && <Skeleton loading />}
                            </Row>
                        ),
                    },
                ]}
                bordered={false}
            />
        </div>
    );
};
