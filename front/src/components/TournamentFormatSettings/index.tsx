import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { TournamentSchema } from "@/shared/validation/tournamentSchema";
import { TournamentFormat } from "@/components/TournamentFormat";
import { Alert, Button, Flex, Form, Typography } from "antd";
import {
    BRACKETS_TYPES,
    STAGE_DEFAULT_SCHEMA,
} from "@/shared/constants/bracketsTypes";
import { useEffect } from "react";
import { useAvailableTournamentCreationOptions } from "@/shared/hooks/useAvailableTournamentCreationOptions";
import { getDeclinations } from "@/shared/lib/getDiclinations";

export const TournamentFormatSettings = () => {
    const { control, trigger } = useFormContext<TournamentSchema>();
    const {
        fields: stages,
        append,
        remove,
    } = useFieldArray({
        control,
        name: "stages",
    });
    const { availableAmountOfStagesInTournament } =
        useAvailableTournamentCreationOptions();
    const onAppend = () => {
        append(STAGE_DEFAULT_SCHEMA);
    };
    const stages_upd = useWatch({ name: "stages" });
    const isLastStageFinal = (
        [
            BRACKETS_TYPES.DOUBLE_ELIMINATION,
            BRACKETS_TYPES.SINGLE_ELIMINATION,
            "",
        ] as Array<string | undefined>
    ).includes(stages_upd[stages_upd.length - 1]?.stage_type);

    useEffect(() => {
        if (stages.length > 1) {
            trigger("stages");
        }
    }, [stages.length]);

    const textAlert = `На текущем уровне подписки вы можете создать
                ${
                    availableAmountOfStagesInTournament === 1
                        ? "простой"
                        : "составной"
                }
                турнир с
                ${getDeclinations({
                    count: availableAmountOfStagesInTournament,
                    one: "этапом",
                    few: "этапами",
                    many: "этапами",
                })}`;
    return (
        <div>
            <Flex vertical={true} gap={16}>
                <div>
                    {stages.map((_: unknown, index: number) => (
                        <TournamentFormat
                            index={index}
                            title={`Этап ${index + 1}`}
                            remove={remove}
                        />
                    ))}
                </div>
                <div>
                    <Form.Item
                        extra={
                            availableAmountOfStagesInTournament !==
                                Infinity && (
                                <Typography.Text
                                    type={"secondary"}
                                    style={{
                                        textAlign: "center",
                                        display: "block",
                                    }}
                                >
                                    {textAlert}
                                </Typography.Text>
                            )
                        }
                    >
                        <Button
                            onClick={onAppend}
                            block
                            disabled={
                                isLastStageFinal ||
                                stages.length >=
                                    availableAmountOfStagesInTournament
                            }
                        >
                            Добавить еще один этап
                        </Button>
                    </Form.Item>
                </div>
            </Flex>
        </div>
    );
};
