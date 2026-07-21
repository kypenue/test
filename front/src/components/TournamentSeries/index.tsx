import { Button, Col, Row, Select, Tooltip, Typography } from "antd";

import { TournamentBrackets } from "@/components/TournamentBrackets";
import { FaExpandArrowsAlt } from "react-icons/fa";
import { useGetTournamentByIdQuery } from "@/services/Tournament/tournament";
import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from "next/navigation";
import { BRACKETS_TYPES } from "@/shared/constants/bracketsTypes";
import { useTournamentStepper } from "@/shared/hooks/useTournamentStepper";
import { useGetStageByIdQuery } from "@/services/Stages/stages";
import { useEffect, useMemo, useState } from "react";
import { SWISS_ROUND_STATUSES } from "@/shared/types/models/Stages";
import { EliminationGroups } from "@/components/DEGroups";
import { createQueryString } from "@/shared/lib/createQueryString";
import { WildcardGroups } from "@/components/WildcardGroups";
import { stagesKeyMapper } from "@/components/TournamentsItem/ActiveItem";
import { Steps } from "./Steps";
import { Navigation } from "./Navigation";
import { SwissStage } from "@/components/TournamentSeries/SwissStage";

export const TournamentSeries = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const { tournamentId } = useParams<{ tournamentId: string }>();
    const [currentRound, setCurrentRound] = useState<string>("");

    const [activeTab, setActiveTab] = useState("rounds");

    const { currentData } = useGetTournamentByIdQuery({ id: tournamentId });
    const { currentStep, currentBracketType, onStepChange } =
        useTournamentStepper();

    const currentStageId = currentData?.stages[currentStep]?.id ?? "";

    const { currentData: currentStage } = useGetStageByIdQuery(
        {
            tournamentId: +tournamentId,
            stageId: currentStageId,
        },
        { skip: !currentStageId, refetchOnMountOrArgChange: true },
    );

    const fullscreenClick = () => {
        const element = document.getElementById("bracket");
        if (element) {
            element.requestFullscreen();
        }
    };

    const rounds = useMemo(() => {
        if (!currentStage) {
            return [];
        }

        if (currentStage[stagesKeyMapper[currentStage.stage_type]]) {
            const rounds =
                currentStage[stagesKeyMapper[currentStage.stage_type]]?.rounds;

            if (rounds?.length) {
                const activeRound = rounds?.find((item) =>
                    [
                        SWISS_ROUND_STATUSES.WAITING_FOR_DRAW,
                        SWISS_ROUND_STATUSES.DRAW_STARTED,
                        SWISS_ROUND_STATUSES.WAITING_FOR_START,
                        SWISS_ROUND_STATUSES.ROUND_STARTED,
                        //@ts-ignore
                    ].includes(item.status),
                );
                if (activeRound) {
                    setCurrentRound(activeRound?.id);
                } else {
                    setCurrentRound(
                        Array.isArray(rounds) && rounds?.length > 0
                            ? rounds[rounds?.length - 1].id
                            : "",
                    );
                }
            }
            return rounds?.map((item) => ({
                label: `Раунд ${item.round_number}`,
                value: item.id,
                disabled:
                    item.status === SWISS_ROUND_STATUSES["ROUND_NOT_STARTED"],
            }));
        }
        return [];
    }, [currentStage]);

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        const qs = createQueryString("tab", tab, searchParams);
        router.replace(pathname + "?" + qs);
    };

    const isEliminationStage = (
        [
            BRACKETS_TYPES.DOUBLE_ELIMINATION,
            BRACKETS_TYPES.SINGLE_ELIMINATION,
        ] as string[]
    ).includes(currentBracketType);

    const isEliminationLoaded =
        currentStage?.de_stage?.rounds || currentStage?.se_stage?.rounds;

    const isSwissStage = currentBracketType === BRACKETS_TYPES["SWISS"];

    useEffect(() => {
        const stages = currentData?.stages;
        if (stages) {
            const stageIndex =
                stages.findLastIndex(
                    (stage) => stage.status === "STAGE_ENDED",
                ) + 1;
            const currentStage =
                stageIndex < stages.length ? stageIndex : stageIndex - 1;
            onStepChange({
                current: currentStage,
                bracketType: stages[currentStage].stage_type,
            });
        }
    }, [currentData]);

    useEffect(() => {
        const tab = searchParams.get("tab");
        if (tab) {
            setActiveTab(tab);
        } else {
            const qs = createQueryString("tab", "rounds", searchParams);
            router.replace(pathname + "?" + qs);
        }
    }, []);

    useEffect(() => {
        if (
            (activeTab === "rating" &&
                currentBracketType === BRACKETS_TYPES.DOUBLE_ELIMINATION) ||
            (activeTab === "backet" && currentBracketType === "SWISS")
        ) {
            setActiveTab("rounds");
            const qs = createQueryString("tab", "rounds", searchParams);
            router.replace(pathname + "?" + qs);
        }
    }, [currentBracketType]);

    if (!currentData) {
        return null;
    }

    return (
        <>
            <Steps
                onChange={onStepChange}
                stages={currentData.stages}
                current={currentStep}
            />
            <Navigation
                currentBracketType={currentBracketType}
                handleTabChange={handleTabChange}
                activeTab={activeTab}
                isEliminationStage={isEliminationStage}
                registration_status={currentData.registration_status}
            />
            <Row gutter={[32, 16]}>
                {isSwissStage && (
                    <SwissStage
                        activeTab={activeTab}
                        currentStageId={currentStageId}
                        currentRound={currentRound}
                        setCurrentRound={setCurrentRound}
                        rounds={rounds}
                    />
                )}
                {currentBracketType === "WILDCARD" && currentStage && (
                    <WildcardGroups
                        tournamentId={tournamentId}
                        stageId={currentStageId}
                        wildcardStageId={currentStage.wildcard_stage?.id ?? ""}
                        roundId={currentRound}
                    />
                )}
                {isEliminationStage && isEliminationLoaded && (
                    <>
                        {activeTab === "rounds" && (
                            <>
                                <Col xs={24} sm={12} md={6}>
                                    {isEliminationStage && (
                                        <Select
                                            style={{
                                                width: "100%",
                                            }}
                                            value={currentRound}
                                            onChange={setCurrentRound}
                                            options={rounds}
                                        />
                                    )}
                                </Col>
                                <Col xs={24}>
                                    {currentStage && (
                                        <EliminationGroups
                                            tournamentId={tournamentId}
                                            stageId={currentStageId}
                                            deStageId={
                                                currentStage?.de_stage?.id ?? ""
                                            }
                                            seStageId={
                                                currentStage?.se_stage?.id ?? ""
                                            }
                                            roundId={currentRound}
                                        />
                                    )}
                                </Col>
                            </>
                        )}
                        {activeTab === "backet" && (
                            <Row style={{ width: "100%" }} justify={"center"}>
                                <Col span={24}>
                                    <Typography.Title level={3}>
                                        Турнирная сетка{" "}
                                        <Tooltip title={"Полноэкранный режим"}>
                                            <Button
                                                icon={<FaExpandArrowsAlt />}
                                                type={"text"}
                                                onClick={fullscreenClick}
                                            />
                                        </Tooltip>
                                    </Typography.Title>
                                </Col>
                                <Col span={24}>
                                    <TournamentBrackets
                                        tournamentId={tournamentId}
                                        stageId={currentStageId}
                                        deStageId={
                                            currentStage?.de_stage?.id ?? ""
                                        }
                                        seStageId={
                                            currentStage?.se_stage?.id ?? ""
                                        }
                                    />
                                </Col>
                            </Row>
                        )}
                    </>
                )}
            </Row>
        </>
    );
};
