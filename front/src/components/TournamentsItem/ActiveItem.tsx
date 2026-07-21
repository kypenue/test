import {
    Alert,
    App,
    Button,
    Card,
    Col,
    Popconfirm,
    Row,
    Skeleton,
    Typography,
} from "antd";
import {
    ArrowRightOutlined,
    DeleteOutlined,
    SettingFilled,
    SettingOutlined,
} from "@ant-design/icons";
import useBreakpoint from "antd/es/grid/hooks/useBreakpoint";
import dayjs from "dayjs";
import {
    _STAGES_URL,
    TournamentListModel,
} from "@/shared/types/models/Tournament";
import { useSetTournamentStatusMutation } from "@/services/Tournament/tournament";
import {
    useEndRoundMutation,
    useGetStagesQuery,
    useSetNewStageRoundMutation,
    useStartRoundMutation,
} from "@/services/Stages/stages";

import s from "./style.module.scss";
import { TournamentStagesStepper } from "@/components/TournamentStagesStepper";
import { useTournamentStepper } from "@/shared/hooks/useTournamentStepper";
import { getErrorMessage } from "@/shared/lib/getErrorMessage";
import {
    BRACKETS_TYPE,
    BRACKETS_TYPES_TEXT,
    STAGE_DEFAULT_SCHEMA,
    STAGES_TYPES,
} from "@/shared/constants/bracketsTypes";
import { useEffect, useMemo } from "react";
import {
    SWISS_ROUND_STATUSES,
    SwissRounds,
    TournamentStage,
} from "@/shared/types/models/Stages";
import Link from "next/link";
import { isEven } from "@/shared/lib/isEven";
import {
    TOURNAMENT_LIFECYCLE_MAP,
    TOURNAMENT_NEXT_LIFECYCLE_ACTION_TEXT_MAP,
} from "@/shared/constants/tournament";
import clsx from "clsx";

interface ActiveItemProps {
    tournament: Omit<
        TournamentListModel,
        | "game_id"
        | "registration_type"
        | "platforms"
        | "cover_image"
        | "header_image"
    >;
    isSettingsButtonVisible?: boolean;
    isStagesStepperVisible?: boolean;
}

export const stagesKeyMapper: Record<
    BRACKETS_TYPE,
    keyof Pick<
        TournamentStage,
        | "swiss_stage"
        | "wildcard_stage"
        | "de_stage"
        | "se_stage"
        | "league_stage"
    >
> = {
    SWISS: "swiss_stage",
    WILDCARD: "wildcard_stage",
    DOUBLE_ELIMINATION: "de_stage",
    SINGLE_ELIMINATION: "se_stage",
    GROUPS: "league_stage",
};

export const ActiveItem = ({
    tournament,
    isSettingsButtonVisible,
    isStagesStepperVisible,
}: ActiveItemProps) => {
    const { message } = App.useApp();

    const { currentData: stages, isLoading } = useGetStagesQuery(
        {
            tournamentId: tournament.id,
        },
        { refetchOnMountOrArgChange: true, skip: !isStagesStepperVisible },
    );

    const { currentStep, onStepChange } = useTournamentStepper();

    useEffect(() => {
        if (stages) {
            const stageIndex =
                stages.findLastIndex(
                    (stage) => stage.status === "STAGE_ENDED",
                ) + 1;

            if (stageIndex < stages.length) {
                onStepChange({
                    current: stageIndex,
                    bracketType: stages[stageIndex].stage_type,
                });
            }
        }
    }, [stages]);

    const { id, tournament_start, tournament_end, lifecycle_status } =
        tournament;

    const [setNewStage, { isLoading: isLoadingStage }] =
        useSetNewStageRoundMutation();

    const breakpoints = useBreakpoint();

    const currentDates = `${dayjs(tournament_start).format("D.MM.YY")} - ${dayjs(tournament_end).format("D.MM.YY")}`;

    const [setStatus, { isLoading: isLoadingStatus }] =
        useSetTournamentStatusMutation();
    const [startRound, { isLoading: isLoadingStartRound }] =
        useStartRoundMutation();
    const [endRound, { isLoading: isLoadingEndRound }] = useEndRoundMutation();

    const handleChangeStatus = (status: number) => {
        setStatus({
            id: id,
            lifecycle_status: status,
        }).then((res) => {
            if ("error" in res && res.error) {
                getErrorMessage(res.error, message);
            } else {
                message.success("Операция выполнена");
            }
        });
    };

    const isLoadingOnCard = isLoadingStage || isLoadingStatus || isLoading;

    const handleNextStage = () => {
        setNewStage({ tournamentId: tournament.id }).then((res) => {
            if ("error" in res && res.error) {
                getErrorMessage(res.error, message);
            } else {
                message.success("Этап начат");
            }
        });
    };

    const activeRound = useMemo(() => {
        if (!stages) {
            return {} as Partial<SwissRounds>;
        }

        if (
            stages[currentStep]?.has_enough_data &&
            stages[currentStep]?.status === STAGES_TYPES.STAGE_STARTED
        ) {
            return (
                stages[currentStep][
                    stagesKeyMapper[stages[currentStep].stage_type]
                ]?.rounds?.find((item) =>
                    [
                        SWISS_ROUND_STATUSES.WAITING_FOR_DRAW,
                        SWISS_ROUND_STATUSES.DRAW_STARTED,
                        SWISS_ROUND_STATUSES.WAITING_FOR_START,
                        SWISS_ROUND_STATUSES.ROUND_STARTED,
                        SWISS_ROUND_STATUSES.ROUND_NOT_STARTED,
                        //@ts-ignore
                    ].includes(item.status),
                ) ?? ({} as Partial<SwissRounds>)
            );
        }
        return {} as Partial<SwissRounds>;
    }, [stages, currentStep]);

    const isDrawStarted =
        activeRound?.status === SWISS_ROUND_STATUSES.DRAW_STARTED;

    const isWaitingForDraw =
        activeRound?.status === SWISS_ROUND_STATUSES.WAITING_FOR_DRAW;

    const isWaitingForStart =
        activeRound?.status === SWISS_ROUND_STATUSES.WAITING_FOR_START ||
        activeRound?.status === SWISS_ROUND_STATUSES.ROUND_NOT_STARTED;

    const isStarted =
        activeRound?.status === SWISS_ROUND_STATUSES.ROUND_STARTED;

    // const isStageEnded =
    //     activeRound?.status === SWISS_ROUND_STATUSES.ROUND_ENDED &&
    //     stages &&
    //     activeRound?.round_number ===
    //         stages[currentStep][stagesKeyMapper[stages[currentStep].stage_type]]
    //             ?.rounds?.length;

    const handleRoundChaneLifecycle = (
        roundId: string,
        lifecycleEvent: "start" | "end",
    ) => {
        if (stages && stages[currentStep]) {
            const data = {
                tournamentId: tournament.id?.toString(),
                swissStageId:
                    stages[currentStep][
                        stagesKeyMapper[stages[currentStep].stage_type]
                    ]?.id ?? "",
                stageId: stages[currentStep].id,
                roundId,
                stageType: _STAGES_URL[stages[currentStep].stage_type],
            };
            const action = lifecycleEvent === "start" ? startRound : endRound;
            action(data).then((res) => {
                if ("error" in res && res.error) {
                    getErrorMessage(res.error, message);
                } else {
                    message.success("Выполнено успешно");
                }
            });
        }
    };

    const isStageSettingsAvailable =
        stages &&
        stages[currentStep] &&
        stages[currentStep]?.has_enough_data &&
        lifecycle_status === 4;

    // @ts-ignore
    const stageType: keyof typeof STAGE_DEFAULT_SCHEMA =
        stages &&
        Object.keys(stages[currentStep])
            // @ts-ignore
            .filter((item) =>
                Object.keys(STAGE_DEFAULT_SCHEMA)
                    .filter((item) => item !== "stage_type")
                    .includes(item),
            )
            // @ts-ignore
            .filter((item) => stages[currentStep][item])[0];

    const shortStageType = stageType?.split("_")[0];

    const nextLifecycleStatus = useMemo(() => {
        if (tournament.teams_used && lifecycle_status === 3) {
            return 7;
        }
        if (tournament.teams_used && lifecycle_status === 8) {
            return 4;
        }
        if (tournament.teams_used && lifecycle_status === 6) {
            // Недосягаемый статус, чтобы не было ошибки
            return 9999999;
        }
        return lifecycle_status + 1
    }, [lifecycle_status, tournament.teams_used]);

    return (
        <div className={s.tournamentCard}>
            <div
                className={clsx(
                    s.activeTournament,
                    !isStagesStepperVisible && s.shortCard,
                )}
            >
                <Row justify="space-between" gutter={[0, 12]}>
                    <Col xs={24} lg={12}>
                        <Row gutter={[0, 24]}>
                            <Col span={24}>
                                <Link href={`/tournaments/${tournament.id}`}>
                                    <p className={s.title}>{tournament.name}</p>
                                    <Typography.Text type="secondary">
                                        {
                                            TOURNAMENT_LIFECYCLE_MAP[
                                            lifecycle_status
                                            ]
                                        }
                                    </Typography.Text>
                                </Link>
                            </Col>
                            <Col span={24}>
                                <div className={s.buttons}></div>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Row gutter={[0, 24]}>
                            <Col
                                span={24}
                                style={{
                                    textAlign: breakpoints.xs
                                        ? "left"
                                        : "right",
                                }}
                            >
                                <p className={s.label}>Даты проведения:</p>
                                <p className={s.date}>{currentDates}</p>
                            </Col>
                            <Col span={24}>
                                <div
                                    className={s.actions}
                                    style={{
                                        justifyContent: breakpoints.xs
                                            ? "flex-start"
                                            : "flex-end",
                                    }}
                                >
                                    {isStagesStepperVisible &&
                                        TOURNAMENT_NEXT_LIFECYCLE_ACTION_TEXT_MAP[
                                        nextLifecycleStatus
                                        ] && (
                                            <Popconfirm
                                                title={
                                                    TOURNAMENT_NEXT_LIFECYCLE_ACTION_TEXT_MAP[
                                                    nextLifecycleStatus
                                                    ]
                                                }
                                                description="Подтверждаете действие?"
                                                okText="Да"
                                                cancelText="Нет"
                                                onConfirm={() =>
                                                    handleChangeStatus(
                                                        nextLifecycleStatus,
                                                    )
                                                }
                                            >
                                                <Button
                                                    className={
                                                        isEven(
                                                            nextLifecycleStatus,
                                                        )
                                                            ? s.greenButton
                                                            : s.redButton
                                                    }
                                                    type="primary"
                                                    size="large"
                                                    loading={isLoadingOnCard}
                                                >
                                                    {
                                                        TOURNAMENT_NEXT_LIFECYCLE_ACTION_TEXT_MAP[
                                                        nextLifecycleStatus
                                                        ]
                                                    }
                                                </Button>
                                            </Popconfirm>
                                        )}
                                    {/* Если пользователь завершил регистрацию, даем ему возможность откатиться назад */}
                                    {isStagesStepperVisible &&
                                        lifecycle_status === 3 && (
                                            <Popconfirm
                                                title={
                                                    "Возобновить регистрацию"
                                                }
                                                description="Подтверждаете действие?"
                                                okText="Да"
                                                cancelText="Нет"
                                                onConfirm={() =>
                                                    handleChangeStatus(2)
                                                }
                                            >
                                                <Button
                                                    className={s.blueButton}
                                                    type="primary"
                                                    size="large"
                                                    loading={isLoadingOnCard}
                                                >
                                                    Возобновить регистрацию
                                                </Button>
                                            </Popconfirm>
                                        )}

                                    <Popconfirm
                                        title="Архивация турнира"
                                        description="Подтверждаете действие?"
                                        okText="Да"
                                        cancelText="Нет"
                                        onConfirm={() => handleChangeStatus(6)}
                                    >
                                        <Button
                                            type="text"
                                            className={s.deleteButton}
                                            icon={<DeleteOutlined />}
                                            disabled={isLoadingOnCard}
                                            size="large"
                                        />
                                    </Popconfirm>

                                    {isSettingsButtonVisible && (
                                        <Button
                                            type="primary"
                                            className={s.deleteButton}
                                            href={`/tournaments/${tournament.id}/settings`}
                                            disabled={isLoadingOnCard}
                                            size="large"
                                        >
                                            Настройки
                                            <ArrowRightOutlined />
                                        </Button>
                                    )}
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
            {lifecycle_status === 7 && (
                <div className={s.footer}>
                    <div className={s.settings}>
                        <Alert
                            message="Жеребьевка команд"
                            type="info"
                            description="Чтобы запустить турнир, необходимо назначить участникам команды"
                            action={
                                <Button
                                    loading={isLoadingOnCard}
                                    size={"small"}
                                    href={`/tournaments/${tournament.id}/playing`}
                                >
                                    Назначить команды
                                </Button>
                            }
                        />

                    </div>
                </div>
            )}

            {isStagesStepperVisible && lifecycle_status >= 4 && lifecycle_status < 7 && (
                <div className={s.footer}>
                    {!stages && isLoading && <Skeleton />}
                    {stages && (
                        <>
                            <TournamentStagesStepper
                                type="default"
                                size="small"
                                stages={stages}
                                current={currentStep}
                                onChange={onStepChange}
                            />
                            <div className={s.settings}>
                                {!stages[currentStep]?.has_enough_data &&
                                    stages[currentStep]?.stage_type ===
                                    "SWISS" &&
                                    stages[currentStep].swiss_stage?.id && (
                                        <Alert
                                            message="Необходима донастройка"
                                            type="info"
                                            description="Чтобы запустить швейцарку, необходимо настроить
                        количество побед и поражений для перехода в следующий
                        этап турнира"
                                            action={
                                                <Button
                                                    loading={isLoadingOnCard}
                                                    size={"small"}
                                                    href={`./settings/${stages[currentStep].id}/${stages[currentStep].swiss_stage?.id}/swiss-calculator/`}
                                                >
                                                    Настроить
                                                </Button>
                                            }
                                        />
                                    )}{" "}
                                {isStageSettingsAvailable && (
                                    <div className={s.stagesButton}>
                                        {stages[currentStep].status ===
                                            STAGES_TYPES.STAGE_NOT_STARTED && (
                                                <Button
                                                    size={"small"}
                                                    onClick={handleNextStage}
                                                    loading={isLoadingOnCard}
                                                    block
                                                >
                                                    Начать этап{" "}
                                                    {
                                                        BRACKETS_TYPES_TEXT[
                                                        stages[currentStep]
                                                            .stage_type
                                                        ]
                                                    }
                                                </Button>
                                            )}
                                        {stages[currentStep].status ===
                                            STAGES_TYPES.STAGE_STARTED && (
                                                <Card style={{ width: "100%" }}>
                                                    <Row justify="space-between">
                                                        <Col>
                                                            Раунд{" "}
                                                            {
                                                                activeRound.round_number
                                                            }
                                                        </Col>
                                                        <Col>
                                                            {(isDrawStarted ||
                                                                isWaitingForDraw) &&
                                                                stages[currentStep][
                                                                    stageType
                                                                    //@ts-ignore
                                                                ]?.id && (
                                                                    <Button
                                                                        size={
                                                                            "small"
                                                                        }
                                                                        loading={
                                                                            isLoadingOnCard
                                                                        }
                                                                        //@ts-ignore
                                                                        href={`/tournaments/${tournament.id}/enemy?type=${shortStageType}&stageId=${stages[currentStep].id}&${shortStageType}StageId=${stages[currentStep][stageType].id}&roundId=${activeRound?.id}`}
                                                                    >
                                                                        {isWaitingForDraw &&
                                                                            "Перейти к жеребьевке"}
                                                                        {isDrawStarted &&
                                                                            "Продолжить жеребьевку"}
                                                                    </Button>
                                                                )}
                                                            {isWaitingForStart && (
                                                                <Button
                                                                    size={"small"}
                                                                    loading={
                                                                        isLoadingStartRound
                                                                    }
                                                                    onClick={() =>
                                                                        handleRoundChaneLifecycle(
                                                                            activeRound?.id ??
                                                                            "",
                                                                            "start",
                                                                        )
                                                                    }
                                                                >
                                                                    Начать раунд
                                                                </Button>
                                                            )}
                                                            {isStarted && (
                                                                <Button
                                                                    size={"small"}
                                                                    loading={
                                                                        isLoadingEndRound
                                                                    }
                                                                    onClick={() =>
                                                                        handleRoundChaneLifecycle(
                                                                            activeRound?.id ??
                                                                            "",
                                                                            "end",
                                                                        )
                                                                    }
                                                                >
                                                                    Завершить раунд
                                                                </Button>
                                                            )}
                                                        </Col>
                                                    </Row>
                                                </Card>
                                            )}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};
