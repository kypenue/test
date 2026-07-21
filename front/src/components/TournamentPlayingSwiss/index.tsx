// @ts-nocheck
import { useMemo, useRef, useState } from "react";
import {
    Button,
    Card,
    Col,
    Modal,
    Popconfirm,
    Row,
    Skeleton,
    Typography,
} from "antd";
import { useToggle } from "usehooks-ts";
import { Resizable } from "re-resizable";

import { ContentCardToss } from "@/components/ContentCardToss";
import { PairModel } from "@/shared/types/models/Tournament";

import {
    useDrawAllParticipantsMutation,
    useDrawOneParticipantMutation,
    useGetSwissParticipantsForDrawQuery,
    useGetParticipantsPairQuery,
} from "@/services/Tournament/tournament";

import { ParticipantItem } from "./ParticipantItem";
import { EmptyPairs } from "./EmptyPairs";
import { PlayingModal } from "./PlayingModal";
import { PlayingGroupModal } from "./PlayingGroupModal";
import { PlayingModalError } from "./PlayingModalError";
import { PairItem } from "./PairItem";

import s from "./style.module.scss";
import { useSearchParams } from "next/navigation";
import { PreviousOpponentMatches } from "@/components/PreviousOpponentMatches";
import { ParticipantsCard } from "@/components/ParticipantsCard";

export interface TournamentEnemyProps {
    tournamentId: string;
}

export const TournamentPlayingSwiss = ({
    tournamentId,
}: TournamentEnemyProps) => {
    const param = useSearchParams();
    const [isButtonLoading, _toggleIsButtonLoading, setIsButtonLoading] =
        useToggle();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isModalErrorOpen, setIsModalErrorOpen] = useState<boolean>(false);
    const [currentPlayers, setCurrentPlayers] = useState<PairModel | undefined>(
        undefined,
    );
    const [isGroupModalOpen, setIsGroupModalOpen] = useState<boolean>(false);

    const [currentGroups, setCurrentGroups] = useState<
        Array<PairModel> | undefined
    >(undefined);
    const [isStatsModalOpen, toggleStatsModalOpen] = useToggle();
    const [activeSeriesId, setActiveSeriesId] = useState<string | null>("");

    const stageId = param.get("stageId") ?? "";
    const swissStageId = param.get("swissStageId") ?? "";
    const roundId = param.get("roundId") ?? "";
    const stageType = param.get("type") ?? "";

    const { currentData: unassignedParticipants, isLoading } =
        useGetSwissParticipantsForDrawQuery({
            tournamentId,
            stageId,
            swissStageId,
            roundId,
        });

    const { currentData: pairs } = useGetParticipantsPairQuery({
        tournamentId,
        stageId,
        swissStageId,
        roundId,
        stageType,
        page: 1,
        per_page: 99999,
    });

    const [setPair] = useDrawOneParticipantMutation();

    const [setAllPair] = useDrawAllParticipantsMutation();

    const ref = useRef<HTMLDivElement>(null);
    const particpantsWithTeamsRef = useRef<HTMLDivElement>(null);

    const handleToss = async () => {
        try {
            setIsButtonLoading(true);

            const res = await setPair({
                tournamentId,
                stageId,
                swissStageId,
                roundId,
                stageType,
            }).unwrap();

            setCurrentPlayers(res);
            setIsModalOpen(true);
        } catch (e) {
            setIsModalErrorOpen(true);
        } finally {
            setIsButtonLoading(false);
        }
    };
    const handleGroupToss = async () => {
        try {
            setIsButtonLoading(true);

            const res = await setAllPair({
                tournamentId,
                stageId,
                swissStageId,
                roundId,
                stageType,
            }).unwrap();

            setCurrentGroups(res);
            setIsGroupModalOpen(true);
        } catch (e) {
            setIsModalErrorOpen(true);
        } finally {
            setIsButtonLoading(false);
        }
    };

    const onCloseModal = () => {
        setIsModalOpen(false);
        if (particpantsWithTeamsRef?.current) {
            particpantsWithTeamsRef?.current?.scrollTo({
                // top: particpantsWithTeamsRef?.current?.scrollHeight + 100,
                top: 0,
                behavior: "smooth",
            });
        }
        setIsButtonLoading(false);
    };

    const onCloseGroupModal = () => {
        setIsGroupModalOpen(false);
        if (particpantsWithTeamsRef?.current) {
            particpantsWithTeamsRef?.current?.scrollTo({
                // top: particpantsWithTeamsRef?.current?.scrollHeight + 100,
                top: 0,
                behavior: "smooth",
            });
        }
        setIsButtonLoading(false);
    };

    const isShowButton = useMemo(() => {
        if (!unassignedParticipants || unassignedParticipants.length === 0) {
            return false;
        }
        return unassignedParticipants.some(
            (item) => !!item.participants.length,
        );
    }, [unassignedParticipants]);

    if (isLoading) {
        return <Skeleton active />;
    }

    const handleStatsModalOpen = (seriesId: string) => {
        setActiveSeriesId(seriesId);
        toggleStatsModalOpen();
    };

    const handleStatsModalClose = () => {
        setActiveSeriesId(null);
        toggleStatsModalOpen();
    };

    return (
        <div>
            <Modal
                width={"100%"}
                onClose={handleStatsModalClose}
                open={isStatsModalOpen}
                onCancel={handleStatsModalClose}
                footer={null}
            >
                <Row gutter={[8, 8]}>
                    <Col span={12}>
                        <PreviousOpponentMatches
                            params={{ tournamentId, seriesId: activeSeriesId }}
                        />
                    </Col>
                    <Col span={12}>
                        <ParticipantsCard
                            isOpen={true}
                            params={{ tournamentId, seriesId: activeSeriesId }}
                        />
                    </Col>
                </Row>
            </Modal>
            <Row style={{ margin: 0 }} gutter={[16, 16]}>
                <Col span={13}>
                    <ContentCardToss
                        color="#0E0029"
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
                                    Список пар:
                                </Typography.Title>
                            </div>
                        }
                    >
                        <Resizable
                            defaultSize={{ height: window.innerHeight - 500 }}
                        >
                            <div
                                ref={particpantsWithTeamsRef}
                                style={{
                                    overflowY: "scroll",
                                    maxHeight: "100%",
                                    scrollbarWidth: "none",
                                    marginBottom: 24,
                                    display: "grid",
                                    gridGap: 8,
                                }}
                            >
                                {pairs && !!pairs?.series_groups.length ? (
                                    pairs?.series_groups.map((groups) => (
                                        <div>
                                            {!!groups.series.length && (
                                                <div
                                                    className={s.groupName}
                                                >{`W${groups.wins_number} L${groups.loses_number}`}</div>
                                            )}
                                            {groups.series.map((pair) => (
                                                <PairItem
                                                    onClick={
                                                        handleStatsModalOpen
                                                    }
                                                    pair={pair.series}
                                                />
                                            ))}
                                        </div>
                                    ))
                                ) : (
                                    <EmptyPairs />
                                )}
                            </div>
                        </Resizable>
                        {isShowButton ? (
                            <Row gutter={[16, 16]} justify="space-between">
                                <Col span={12}>
                                    <Button
                                        style={{ padding: "18px 0" }}
                                        onClick={handleToss}
                                        block
                                        disabled={isButtonLoading}
                                        type={"primary"}
                                    >
                                        Создать пару
                                    </Button>
                                </Col>
                                <Col span={12}>
                                    <Popconfirm
                                        title="Разбить всех участников"
                                        description="Подтверждаете действие?"
                                        okText="Да"
                                        cancelText="Нет"
                                        onConfirm={handleGroupToss}
                                    >
                                        <Button
                                            style={{ padding: "18px 0" }}
                                            // onClick={handleGroupToss}
                                            block
                                            disabled={isButtonLoading}
                                            type={"primary"}
                                        >
                                            Разбить группу на пары
                                        </Button>
                                    </Popconfirm>
                                </Col>
                            </Row>
                        ) : (
                            <Row gutter={[16, 16]} justify="space-between">
                                <Col span={24}>
                                    <Button
                                        style={{ padding: "18px 0" }}
                                        onClick={handleToss}
                                        block
                                        href={`/tournaments/${tournamentId}/settings`}
                                        type={"primary"}
                                    >
                                        Завершить жеребьевку
                                    </Button>
                                </Col>
                            </Row>
                        )}
                    </ContentCardToss>
                </Col>
                <Col span={11}>
                    <Row gutter={[16, 16]}>
                        {unassignedParticipants &&
                            unassignedParticipants.map((item) => (
                                <>
                                    {!!item.participants.length && (
                                        <Col span={12}>
                                            <ContentCardToss
                                                title={
                                                    <div
                                                        className={s.cardTitle}
                                                    >
                                                        <Typography.Title
                                                            style={{
                                                                fontSize: 19,
                                                                fontWeight: 400,
                                                                textAlign:
                                                                    "center",
                                                                marginBottom: 0,
                                                            }}
                                                        >
                                                            {`Группа W${item.wins_number} L${item.loses_number}`}
                                                            <Typography.Title
                                                                style={{
                                                                    fontSize: 17,
                                                                    fontWeight: 400,
                                                                    textAlign:
                                                                        "center",
                                                                    marginBottom: 0,
                                                                    marginTop:
                                                                        "8px",
                                                                    color: "#B9BEEC",
                                                                }}
                                                            >
                                                                Игроков:{" "}
                                                                {item.participants &&
                                                                    `${item.participants.length}`}
                                                            </Typography.Title>
                                                        </Typography.Title>
                                                    </div>
                                                }
                                                color="#0E0029"
                                            >
                                                <Resizable
                                                    defaultSize={{
                                                        height:
                                                            window.innerHeight -
                                                            558,
                                                    }}
                                                >
                                                    <div
                                                        ref={ref}
                                                        style={{
                                                            overflowY: "scroll",
                                                            maxHeight: "100%",
                                                            scrollbarWidth:
                                                                "none",
                                                            display: "grid",
                                                            gridGap: 8,
                                                        }}
                                                    >
                                                        {item.participants &&
                                                            item.participants.map(
                                                                (pair) => (
                                                                    <Card
                                                                        id={pair.id?.toString()}
                                                                        className={
                                                                            s.item
                                                                        }
                                                                        style={{
                                                                            marginBottom: 8,
                                                                            background:
                                                                                "#0E0029",
                                                                        }}
                                                                        key={pair.id?.toString()}
                                                                    >
                                                                        <ParticipantItem
                                                                            participant={
                                                                                pair
                                                                            }
                                                                        />
                                                                    </Card>
                                                                ),
                                                            )}
                                                    </div>
                                                </Resizable>
                                            </ContentCardToss>
                                        </Col>
                                    )}
                                </>
                            ))}
                    </Row>
                </Col>
            </Row>
            <PlayingModal
                isModalOpen={isModalOpen}
                isSwiss={true}
                onCloseModal={onCloseModal}
                currentPlayers={currentPlayers}
            />
            <PlayingGroupModal
                isModalOpen={isGroupModalOpen}
                onCloseModal={onCloseGroupModal}
                currentPlayers={currentGroups}
            />
            <PlayingModalError isModalOpen={isModalErrorOpen} onCloseModal={() => setIsModalErrorOpen(false)} />
        </div>
    );
};
