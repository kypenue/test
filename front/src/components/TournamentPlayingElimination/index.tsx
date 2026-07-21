import { useRef, useState } from "react";
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
import { DotLottie, DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useToggle } from "usehooks-ts";
import { Resizable } from "re-resizable";

import { ContentCardToss } from "@/components/ContentCardToss";
import { PairModel } from "@/shared/types/models/Tournament";

import {
    useDrawAllParticipantsMutation,
    useDrawOneParticipantMutation,
    useGetEliminationParticipantsForDrawQuery,
    useGetParticipantsPairQuery,
} from "@/services/Tournament/tournament";

import { ParticipantItem } from "./ParticipantItem";
import { PairItem } from "./PairItem";

import s from "./style.module.scss";
import { useSearchParams } from "next/navigation";
import { PlayingModal } from "@/components/TournamentPlayingSwiss/PlayingModal";
import { PlayingGroupModal } from "@/components/TournamentPlayingSwiss/PlayingGroupModal";
import { EmptyPairs } from "@/components/TournamentPlayingSwiss/EmptyPairs";

export interface TournamentEnemyProps {
    tournamentId: string;
}

export const TournamentPlayingElimination = ({
    tournamentId,
}: TournamentEnemyProps) => {
    const [isButtonLoading, _toggleIsButtonLoading, setIsButtonLoading] =
        useToggle();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [currentPlayers, setCurrentPlayers] = useState<PairModel | undefined>(
        undefined,
    );
    const [isGroupModalOpen, setIsGroupModalOpen] = useState<boolean>(false);

    const [currentGroups, setCurrentGroups] = useState<
        Array<PairModel> | undefined
    >(undefined);
    const [dotLottie, setDotLottie] = useState<DotLottie | null>(null);

    const param = useSearchParams();
    const stageId = param.get("stageId") ?? "";
    const deStageId = param.get("deStageId") ?? "";
    const seStageId = param.get("seStageId") ?? "";
    const stageType = param.get("type") ?? "";
    const roundId = param.get("roundId") ?? "";

    const { currentData: pairs, isLoading: isLoadingPairs } =
        useGetParticipantsPairQuery({
            tournamentId,
            stageId,
            seStageId,
            deStageId,
            roundId,
            stageType,
            page: 1,
            per_page: 99999,
            new_first: true,
        });

    const { currentData: participants, isLoading: isLoadingParticipants } =
        useGetEliminationParticipantsForDrawQuery({
            tournamentId,
            stageId,
            seStageId,
            deStageId,
            roundId,
            stageType,
            page: 1,
            per_page: 99999,
            is_assigned: false,
        });

    const [setPair] = useDrawOneParticipantMutation();

    const [setAllPair] = useDrawAllParticipantsMutation();

    const ref = useRef<HTMLDivElement>(null);
    const particpantsWithTeamsRef = useRef<HTMLDivElement>(null);

    const isLoading = isLoadingParticipants || isLoadingPairs;
    const handleGroupToss = () => {
        setIsButtonLoading(true);
        setAllPair({
            tournamentId,
            stageId,
            deStageId,
            seStageId,
            roundId,
            // @ts-ignore
            stageType,
        }).then((res) => {
            setCurrentGroups(res.data);
            setIsGroupModalOpen(true);
        });
    };

    const handleToss = () => {
        setIsButtonLoading(true);
        setPair({
            tournamentId,
            stageId,
            deStageId,
            seStageId,
            // @ts-ignore
            stageType,
            roundId,
        }).then((res) => {
            setCurrentPlayers(res.data);
            setIsModalOpen(true);
        });
    };

    const onCloseModal = () => {
        setIsModalOpen(false);
        if (particpantsWithTeamsRef?.current) {
            particpantsWithTeamsRef?.current?.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        }
        setIsButtonLoading(false);
    };

    const afterOpenChange = (open: boolean) => {
        if (dotLottie && open) {
            dotLottie.play();

            setTimeout(() => {
                onCloseModal();
            }, 4000);
        }
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

    const isButtonTossDisabled = isButtonLoading || !participants?.length;

    if (isLoading) {
        return <Skeleton active />;
    }

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
                                        fontSize: 16,
                                        fontWeight: 400,
                                        textAlign: "center",
                                        marginBottom: 0,
                                    }}
                                >
                                    Список пар
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
                                {pairs && !!pairs.series?.length ? (
                                    pairs?.series?.map((pair) => (
                                        <PairItem pair={pair.series} />
                                    ))
                                ) : (
                                    <EmptyPairs />
                                )}
                            </div>
                        </Resizable>

                        <Row gutter={[16, 16]}>
                            <Col xs={12}>
                                <Button
                                    style={{ padding: "18px 0" }}
                                    onClick={handleToss}
                                    block
                                    disabled={isButtonTossDisabled}
                                    type={"primary"}
                                >
                                    Назначить пару
                                </Button>
                            </Col>
                            <Col xs={12}>
                                <Popconfirm
                                    title="Разбить всех участников"
                                    description="Подтверждаете действие?"
                                    okText="Да"
                                    cancelText="Нет"
                                    onConfirm={handleGroupToss}
                                >
                                    <Button
                                        style={{ padding: "18px 0" }}
                                        block
                                        disabled={isButtonTossDisabled}
                                        type={"primary"}
                                    >
                                        Разбить группу на пары
                                    </Button>
                                </Popconfirm>
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
                <Col span={8}>
                    <ContentCardToss
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
                                    Список участников&nbsp;
                                    {participants && `(${participants.length})`}
                                </Typography.Title>
                            </div>
                        }
                        color="#0E0029"
                    >
                        <Resizable
                            defaultSize={{ height: window.innerHeight - 450 }}
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
                                    participants.map((pair) => (
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
                                                account={pair}
                                                // team={pair?.team}
                                            />
                                        </Card>
                                    ))}
                            </div>
                        </Resizable>
                    </ContentCardToss>
                </Col>
            </Row>
            <PlayingModal
                isModalOpen={isModalOpen}
                onCloseModal={onCloseModal}
                isSwiss={false}
                // @ts-ignore review props
                currentPlayers={currentPlayers}
            />
            <PlayingGroupModal
                isModalOpen={isGroupModalOpen}
                onCloseModal={onCloseGroupModal}
                // @ts-ignore review props
                currentPlayers={currentGroups}
            />
        </div>
    );
};
