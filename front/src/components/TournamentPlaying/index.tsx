import { useCallback, useRef, useState } from "react";
import { Button, Card, Col, Modal, Row, Skeleton, Typography } from "antd";
import { useToggle } from "usehooks-ts";
import { Resizable } from "re-resizable";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

import {
    useGetTournamentParticipantsQuery,
    useGetTournamentParticipantsTossQuery,
} from "@/services/Tournament/tournament";

import {
    useGetTournamentTeamsQuery,
    useDrawOneMutation,
} from "@/services/Teams";

import type { TournamentRegisteredUserReadSchema } from "@/services/Teams/teams.model";

import { ContentCardToss } from "@/components/ContentCardToss";
import { ParticipantItem } from "./ParticipantItem";
import { TeamLogo } from "./TeamLogo";
import { TeamItem } from "./TeamItem";

import s from "./TournamentPlaying.module.scss";

dayjs.extend(customParseFormat);

export interface TournamentParticipantsProps {
    tournamentId: string;
}

export const TournamentPlaying = ({
    tournamentId,
}: TournamentParticipantsProps) => {
    const [isButtonLoading, _toggleIsButtonLoading, setIsButtonLoading] =
        useToggle();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [currentPlayer, setCurrentPlayer] = useState<
        TournamentRegisteredUserReadSchema | undefined
    >(undefined);

    const { currentData: participants, isLoading: isLoadingParticipants } =
        useGetTournamentParticipantsTossQuery({ id: tournamentId });

    const {
        currentData: participantsWithTeam,
        isLoading: isLoadingParticipantsWithTeam,
    } = useGetTournamentParticipantsQuery({
        id: tournamentId,
        team_id__isnull: false,
        is_team_shown: true,
        per_page: 10000,
        order_by: "updated_at",
    });

    const { currentData: teams, isLoading: isLoadingTeams } =
        useGetTournamentTeamsQuery({
            tournament_id: Number(tournamentId),
            per_page: 1000,
        });

    const [setTeam, setTeamResponse] = useDrawOneMutation();

    const ref = useRef<HTMLDivElement>(null);
    const particpantsWithTeamsRef = useRef<HTMLDivElement>(null);

    const isLoading =
        isLoadingParticipants ||
        isLoadingParticipantsWithTeam ||
        isLoadingTeams;

    const participantsCount = useCallback(() => {
        return participants?.length;
    }, [participants]);

    const handleToss = () => {
        setIsButtonLoading(true);
        if (participants && participants.length) {
            const deleteListItem = (id: string) => {
                if (!ref.current) return;
                const listItem = document.getElementById(id)!;
                const scrollPos =
                    listItem.offsetTop -
                    ref.current?.getBoundingClientRect()?.height / 2 -
                    listItem.getBoundingClientRect().height / 2;

                ref.current?.scrollTo({ top: scrollPos, behavior: "smooth" });

                setTimeout(() => {
                    listItem.classList.add("is-deleting");
                    listItem.style.backgroundColor = "#22195A";

                    setTimeout(() => {
                        listItem.style.opacity = "0";
                        listItem.style.height = "0";
                    }, 500);
                }, 1000);
            };

            setTeam({ tournament_id: Number(tournamentId) }).then((res) => {
                if (res.data) {
                    deleteListItem(res.data.id?.toString());

                    setTimeout(() => {
                        setIsModalOpen(true);
                        setCurrentPlayer(res.data);
                    }, 2000);
                    setTimeout(() => {
                        onCloseModal();
                    }, 4000);
                }
                setIsButtonLoading(false);
            });
        }
    };

    if (isLoading) {
        return <Skeleton active />;
    }

    const onCloseModal = () => {
        if (particpantsWithTeamsRef?.current) {
            particpantsWithTeamsRef?.current?.scrollTo({
                top: particpantsWithTeamsRef?.current?.scrollHeight + 100,
                behavior: "smooth",
            });
        }
        setIsModalOpen(false);
        setIsButtonLoading(false);
        setCurrentPlayer(undefined);
    };

    // @ts-ignore
    return (
        <div>
            <Row style={{ margin: 0 }} gutter={[16, 16]}>
                <Col span={16}>
                    <ContentCardToss
                        color="#0E0029"
                        title={
                            <div className={s.cardTitle}>
                                <Typography.Title
                                    style={{
                                        fontSize: 19,
                                        textAlign: "center",
                                        marginBottom: 0,
                                    }}
                                >
                                    Команды
                                </Typography.Title>
                            </div>
                        }
                    >
                        <Resizable
                            defaultSize={{ height: window.innerHeight - 500 }}
                        >
                            <div
                                style={{
                                    overflowY: "scroll",
                                    maxHeight: "100%",
                                    scrollbarWidth: "none",
                                    marginBottom: 24,
                                    display: "grid",
                                    gridGap: 8,
                                }}
                                ref={particpantsWithTeamsRef}
                            >
                                {participantsWithTeam &&
                                    participantsWithTeam?.payload?.map(
                                        (participant, index) => (
                                            <Card
                                                className={s.teamsCard}
                                                key={index}
                                            >
                                                <Row
                                                    justify={"space-between"}
                                                    align={"middle"}
                                                >
                                                    <Col span={8}>
                                                        <Row
                                                            align={"middle"}
                                                            gutter={[8, 8]}
                                                        >
                                                            <Col>
                                                                <TeamLogo
                                                                    team={
                                                                        participant.team
                                                                    }
                                                                />
                                                            </Col>
                                                            <Col>
                                                                <Typography.Title
                                                                    level={5}
                                                                >
                                                                    {
                                                                        participant
                                                                            .team
                                                                            ?.name
                                                                    }
                                                                </Typography.Title>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                    <Col>
                                                        <Typography.Title
                                                            style={{
                                                                textAlign:
                                                                    "left",
                                                            }}
                                                            level={5}
                                                        >
                                                            {
                                                                participant
                                                                    .account
                                                                    .user.name
                                                            }
                                                            &nbsp;
                                                            {
                                                                participant
                                                                    .account
                                                                    .user
                                                                    .surname
                                                            }
                                                            ,&nbsp;
                                                            {dayjs(
                                                                Date.now(),
                                                            ).diff(
                                                                dayjs(
                                                                    participant
                                                                        .account
                                                                        .user
                                                                        .birth_date,
                                                                    "YYYY-MM-DD",
                                                                ),
                                                                "year",
                                                            )}
                                                        </Typography.Title>
                                                    </Col>

                                                    <Col
                                                        span={10}
                                                        style={{
                                                            textAlign: "right",
                                                        }}
                                                    >
                                                        <ParticipantItem
                                                            account={
                                                                participant.account
                                                            }
                                                        />
                                                    </Col>
                                                </Row>
                                            </Card>
                                        ),
                                    )}
                            </div>
                        </Resizable>
                    </ContentCardToss>
                </Col>
                <Col span={8}>
                    <ContentCardToss
                        title={
                            <div className={s.cardTitle}>
                                <Typography.Title
                                    style={{
                                        fontSize: 19,
                                        textAlign: "center",
                                        marginBottom: 0,
                                    }}
                                >
                                    Участники {`(${participantsCount()})`}
                                </Typography.Title>
                            </div>
                        }
                        color="#0E0029"
                    >
                        <Resizable
                            defaultSize={{ height: window.innerHeight - 558 }}
                        >
                            <div
                                ref={ref}
                                style={{
                                    overflowY: "scroll",
                                    maxHeight: "100%",
                                    scrollbarWidth: "none",
                                    display: "grid",
                                    gridGap: 8,
                                }}
                            >
                                {participants &&
                                    participants.map((pair, index) => (
                                        <Card
                                            id={pair.id?.toString()}
                                            className={s.item}
                                            style={{
                                                marginBottom: 8,
                                                background: "#0E0029",
                                            }}
                                            key={pair.id?.toString()}
                                        >
                                            <ParticipantItem
                                                account={pair.account}
                                            />{" "}
                                        </Card>
                                    ))}
                            </div>
                        </Resizable>

                        <Row gutter={[16, 16]}>
                            <Col span={24}>
                                <Button
                                    style={{ padding: "18px 0" }}
                                    onClick={handleToss}
                                    block
                                    disabled={
                                        isButtonLoading || !participants?.length
                                    }
                                    type={"primary"}
                                >
                                    Назначить команду
                                </Button>
                            </Col>
                            <Col span={24}>
                                {!participants?.length && (
                                    <Button
                                        style={{ padding: "18px 0" }}
                                        onClick={handleToss}
                                        block
                                        href={`/tournaments/${tournamentId}/settings`}
                                        type={"primary"}
                                    >
                                        Завершить жеребьевку
                                    </Button>
                                )}
                            </Col>
                        </Row>
                    </ContentCardToss>
                </Col>
            </Row>
            {!!teams && !!teams.payload && (
                <div
                    style={{
                        width: "100%",
                        margin: "10px 18px",
                        paddingLeft: 18,
                    }}
                >
                    <Row gutter={[4, 8]} align={"middle"}>
                        <Col span={24}>
                            <TeamItem teams={teams.payload} />
                        </Col>
                    </Row>
                </div>
            )}
            <Modal
                open={isModalOpen}
                className={s.customModal}
                mask={true}
                maskClosable={true}
                centered={true}
                closable={false}
                footer={""}
                onCancel={onCloseModal}
                width="800px"
            >
                <Row gutter={[32, 32]} justify={"center"} align={"middle"}>
                    {currentPlayer && (
                        <>
                            <Col>
                                <div className={s.modalTeam}>
                                    <Row gutter={[24, 12]} align={"middle"}>
                                        <Col>
                                            <div className={s.glowBlock}>
                                                <TeamLogo
                                                    team={currentPlayer.team}
                                                    isLarge
                                                />
                                            </div>
                                        </Col>
                                        <Col>
                                            <Typography.Title
                                                level={2}
                                                style={{ marginBottom: 0 }}
                                            >
                                                {currentPlayer.team?.name}
                                            </Typography.Title>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                            <Col>
                                <Typography.Title
                                    level={1}
                                    style={{ marginBottom: 0 }}
                                >
                                    {currentPlayer.account?.login} (
                                    {currentPlayer.account?.user?.name}&nbsp;
                                    {currentPlayer.account?.user?.surname})
                                </Typography.Title>
                            </Col>
                        </>
                    )}
                </Row>
            </Modal>
        </div>
    );
};
