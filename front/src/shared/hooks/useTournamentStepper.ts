import { useState } from "react";
import { BRACKETS_TYPE } from "@/shared/constants/bracketsTypes";
import { TournamentStagesStepperProps } from "@/components/TournamentStagesStepper";

export const useTournamentStepper = () => {
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [currentBracketType, setCurrentBracketType] = useState<BRACKETS_TYPE>(
        "SWISS" as BRACKETS_TYPE,
    );

    const onStepChange: TournamentStagesStepperProps["onChange"] = ({
        current,
        bracketType,
    }) => {
        setCurrentStep(current);
        setCurrentBracketType(bracketType);
    };

    return { currentStep, currentBracketType, onStepChange };
};
