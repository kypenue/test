import { useMemo } from "react";
import {
    BRACKETS_TYPE,
    BRACKETS_TYPES,
    BRACKETS_TYPES_TEXT,
    STAGES_TYPES,
    STAGES_TYPES_TEXT,
} from "@/shared/constants/bracketsTypes";
import { StepProps, Steps, StepsProps } from "antd";
import s from "./style.module.scss";
import { TournamentStage } from "@/shared/types/models/Stages";

export interface TournamentStagesStepperProps
    extends Omit<StepsProps, "onChange"> {
    stages: Array<TournamentStage>;
    current: number;
    onChange: ({
        current,
        bracketType,
    }: {
        current: number;
        bracketType: BRACKETS_TYPE;
    }) => void;
}

export const TournamentStagesStepper = ({
    // @ts-ignore
    stages,
    current,
    onChange,
    ...rest
}: TournamentStagesStepperProps) => {
    const allStages = useMemo(() => {
        return stages?.reduce((curr, item) => {
            const stepItem = {
                title: BRACKETS_TYPES_TEXT[item.stage_type],
                status: "process" as StepsProps["status"],
                // @ts-ignore
                description: STAGES_TYPES_TEXT[item.status],
                disabled:
                    curr.length !== 0 &&
                    STAGES_TYPES.STAGE_NOT_STARTED === item.status,
                subTitle:
                    item.stage_type === BRACKETS_TYPES.SWISS &&
                    item.swiss_stage?.wins_needed &&
                    item.swiss_stage?.loses_needed &&
                    `${item.swiss_stage.wins_needed}W | ${item.swiss_stage.loses_needed}L`,
            };
            return [...curr, stepItem];
        }, [] as StepProps[]);
    }, [stages]);

    const handleOnChange = (value: number) => {
        const reverseTypes = Object.fromEntries(
            Object.entries(BRACKETS_TYPES_TEXT).map(([key, value]) => [
                value,
                key,
            ]),
        ) as Record<string, BRACKETS_TYPE>;

        onChange({
            current: value,
            // @ts-ignore
            bracketType: reverseTypes[allStages[value].title],
        });
    };

    return (
        <Steps
            {...rest}
            current={current}
            onChange={handleOnChange}
            items={allStages}
            className={s.stepper}
            responsive={true}
        />
    );
};
