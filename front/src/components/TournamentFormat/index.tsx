import {
    Controller,
    UseFieldArrayRemove,
    useFormContext,
    useWatch,
} from "react-hook-form";
import {
    Button,
    Divider,
    Flex,
    Form,
    Input,
    Modal,
    Radio,
    Switch,
    Tooltip,
    Typography,
} from "antd";
import { TournamentSchema } from "@/shared/validation/tournamentSchema";
import s from "./style.module.scss";
import CardSelector from "@/components/CardsSelector";
import {
    BRACKETS_OPTIONS,
    BRACKETS_TYPE,
    BRACKETS_TYPES,
    BRACKETS_TYPES_TEXT,
    DE_STAGE_DEFAULT_SCHEMA,
    SE_STAGE_DEFAULT_SCHEMA,
    STAGE_DEFAULT_SCHEMA,
    SWISS_STAGE_DEFAULT_SCHEMA,
    SWISS_TYPES,
    WILDCARD_STAGE_DEFAULT_SCHEMA,
} from "@/shared/constants/bracketsTypes";
import { CloseOutlined } from "@ant-design/icons";
import { getFormStatus } from "@/shared/lib/getFormStatus";
import { useSubscriptionLevel } from "@/shared/hooks/useSubscriptionLevel";
import { useAvailableTournamentCreationOptions } from "@/shared/hooks/useAvailableTournamentCreationOptions";
import { useMemo } from "react";

interface TournamentFormatProps {
    title: string;
    index: number;
    remove: UseFieldArrayRemove;
}

export const TournamentFormat = ({
    title,
    index,
    remove,
}: TournamentFormatProps) => {
    const { control, setValue, watch, getFieldState, trigger, formState } =
        useFormContext<TournamentSchema>();

    const stageType = useWatch({ name: `stages.${index}.stage_type` });
    const nextStageType = useWatch({ name: `stages.${index + 1}.stage_type` });

    const { availableAmountOfStagesInTournament } =
        useAvailableTournamentCreationOptions();

    const isSwissIntermediateAdded = useWatch({
        name: `stages.${index}.swiss_stage.add_intermediate`,
    });
    const swissIntermediateType = useWatch({
        name: `stages.${index}.swiss_stage.intermediate_type`,
    });

    // const onSuggestIntermediateStage = (index: number) => {
    //     Modal.confirm({
    //         title: "Добавить промежуточный этап?",
    //         content:
    //             "Этап запускается при условии, что кол-во участников проходящих в этап Double Elimination не кратно степени двойки. В промежуточный этап попадают последние из списка участники рейтинга, сформированного по результатам этапа Swiss system tournament.",
    //         okText: "Добавить",
    //         onOk: () => {
    //             const afterSwissStage = watch(`stages.${index}`);
    //             console.log(afterSwissStage);
    //             insert(index + 1, STAGE_DEFAULT_SCHEMA);
    //             setValue(`stages.${index + 1}.stage_type`, "WILDCARD", {
    //                 shouldDirty: true,
    //                 shouldValidate: true,
    //             });
    //             setValue(
    //                 `stages.${index + 1}.wildcard_stage`,
    //                 WILDCARD_STAGE_DEFAULT_SCHEMA,
    //             );
    //             move(index + 1, index);
    //             // append(afterSwissStage)
    //         },
    //         cancelText: "Не добавлять",
    //         onCancel: () => {},
    //     });
    // };

    const onRemoveStage = () => {
        Modal.confirm({
            title: "Удалить этап?",
            okText: "Удалить",
            onOk: () => {
                remove(index);
            },
            cancelText: "Отменить",
            onCancel: () => {},
        });
    };

    const handleChangeStageType = (id: string | number) => {
        setValue(`stages.${index}`, STAGE_DEFAULT_SCHEMA, {
            shouldDirty: true,
            shouldValidate: true,
        });
        setValue(`stages.${index}.stage_type`, id as BRACKETS_TYPE, {
            shouldDirty: true,
            shouldValidate: true,
        });
        if (id === BRACKETS_TYPES.SWISS) {
            setValue(`stages.${index}.swiss_stage`, SWISS_STAGE_DEFAULT_SCHEMA);
        }
        if (id === BRACKETS_TYPES.DOUBLE_ELIMINATION) {
            setValue(`stages.${index}.de_stage`, DE_STAGE_DEFAULT_SCHEMA);
        }
        if (id === BRACKETS_TYPES.SINGLE_ELIMINATION) {
            setValue(`stages.${index}.se_stage`, SE_STAGE_DEFAULT_SCHEMA);
        }
        if (id === BRACKETS_TYPES.WILDCARD) {
            setValue(
                `stages.${index}.wildcard_stage`,
                WILDCARD_STAGE_DEFAULT_SCHEMA,
            );
        }
    };

    const isOnlySwissPlaying =
        index === 0 &&
        stageType === BRACKETS_TYPES.SWISS &&
        typeof nextStageType === "undefined";

    const isWildcardAvailable = [
        BRACKETS_TYPES.DOUBLE_ELIMINATION,
        BRACKETS_TYPES.SINGLE_ELIMINATION,
    ].includes(nextStageType);

    const availableOptionsInFirstStage = useMemo(
        () =>
            BRACKETS_OPTIONS.map((option) =>
                BRACKETS_TYPES.SWISS === option.id &&
                availableAmountOfStagesInTournament === 1
                    ? {
                          ...option,
                          disabled: true,
                      }
                    : option,
            ).slice(0, 4),
        [availableAmountOfStagesInTournament],
    );

    return (
        <div>
            <Divider plain={false}>
                {title}{" "}
                {stageType &&
                    ` - ${BRACKETS_TYPES_TEXT[stageType as keyof typeof BRACKETS_TYPES_TEXT]}`}{" "}
                {index !== 0 && (
                    <Button
                        icon={<CloseOutlined className={s.closeIcon} />}
                        type={"link"}
                        onClick={onRemoveStage}
                    />
                )}
            </Divider>
            <Flex vertical={true} gap={16}>
                <div>
                    <Controller
                        control={control}
                        name={`stages.${index}.stage_type`}
                        render={({ field, fieldState }) => (
                            <Form.Item
                                validateStatus={getFormStatus(
                                    fieldState?.error?.message,
                                )}
                                help={fieldState?.error?.message}
                                layout="vertical"
                                label="Формат сетки"
                            >
                                <CardSelector
                                    options={
                                        index === 0
                                            ? availableOptionsInFirstStage
                                            : BRACKETS_OPTIONS
                                    }
                                    iconStyle={{
                                        width: "50px",
                                        height: "50px",
                                    }}
                                    {...field}
                                    onChange={handleChangeStageType}
                                />
                            </Form.Item>
                        )}
                    />
                </div>
                {stageType === BRACKETS_TYPES.WILDCARD && (
                    <>
                        <div>
                            <Controller
                                control={control}
                                name={`stages.${index}.wildcard_stage.game_number`}
                                render={({ field, fieldState, formState }) => (
                                    <Form.Item
                                        validateStatus={getFormStatus(
                                            fieldState?.error?.message,
                                        )}
                                        help={fieldState?.error?.message}
                                        layout="vertical"
                                        label="Количество игр серии в wildcard"
                                    >
                                        <Input
                                            prefix="BO"
                                            type="number"
                                            min={1}
                                            max={7}
                                            step={2}
                                            size={"large"}
                                            style={{ width: "fit-content" }}
                                            {...field}
                                            onBlur={() => trigger(field.name)}
                                        />
                                    </Form.Item>
                                )}
                            />
                        </div>
                    </>
                )}
                {stageType === BRACKETS_TYPES.DOUBLE_ELIMINATION && (
                    <>
                        <div>
                            <Controller
                                control={control}
                                name={`stages.${index}.de_stage.game_number`}
                                render={({ field, fieldState, formState }) => (
                                    <Form.Item
                                        validateStatus={getFormStatus(
                                            fieldState?.error?.message,
                                        )}
                                        help={fieldState?.error?.message}
                                        layout="vertical"
                                        label="Количество игр серии в основной сетке"
                                    >
                                        <Input
                                            prefix="BO"
                                            type="number"
                                            min={1}
                                            max={7}
                                            step={2}
                                            size={"large"}
                                            style={{ width: "fit-content" }}
                                            {...field}
                                            onBlur={() => trigger(field.name)}
                                        />
                                    </Form.Item>
                                )}
                            />
                        </div>

                        <div>
                            <Controller
                                control={control}
                                name={`stages.${index}.de_stage.final_game_number`}
                                render={({ field, fieldState, formState }) => (
                                    <Form.Item
                                        validateStatus={getFormStatus(
                                            fieldState?.error?.message,
                                        )}
                                        help={fieldState?.error?.message}
                                        layout="vertical"
                                        label="Количество игр серии в суперфинале"
                                    >
                                        <Input
                                            prefix="BO"
                                            type="number"
                                            min={1}
                                            max={10}
                                            step={2}
                                            size={"large"}
                                            style={{ width: "fit-content" }}
                                            {...field}
                                            onBlur={() => trigger(field.name)}
                                        />
                                        <Controller
                                            control={control}
                                            name={`stages.${index}.de_stage.winner_bracket_advantage`}
                                            render={({ field }) => (
                                                <Form.Item
                                                    style={{ marginTop: 8 }}
                                                    label={""}
                                                >
                                                    <Flex
                                                        align={"center"}
                                                        gap={8}
                                                    >
                                                        <div>
                                                            <Switch
                                                                {...field}
                                                                checked={
                                                                    field.value
                                                                }
                                                            />
                                                        </div>
                                                        <div>
                                                            <Typography.Text
                                                                style={{
                                                                    fontWeight: 600,
                                                                }}
                                                            >
                                                                Фора у
                                                                победителя
                                                            </Typography.Text>
                                                            <br />
                                                            <Typography.Text>
                                                                Победитель из
                                                                корзины
                                                                победителей
                                                                начинает
                                                                финальную серию
                                                                с форой в 1
                                                                победу
                                                            </Typography.Text>
                                                        </div>
                                                    </Flex>
                                                </Form.Item>
                                            )}
                                        />
                                    </Form.Item>
                                )}
                            />
                        </div>
                    </>
                )}
                {stageType === BRACKETS_TYPES.SINGLE_ELIMINATION && (
                    <>
                        <div>
                            <Controller
                                control={control}
                                name={`stages.${index}.se_stage.game_number`}
                                render={({ field, fieldState, formState }) => (
                                    <Form.Item
                                        validateStatus={getFormStatus(
                                            fieldState?.error?.message,
                                        )}
                                        help={fieldState?.error?.message}
                                        layout="vertical"
                                        label="Количество игр серии в основной сетке"
                                    >
                                        <Input
                                            prefix="BO"
                                            type="number"
                                            min={1}
                                            max={7}
                                            step={2}
                                            size={"large"}
                                            style={{ width: "fit-content" }}
                                            {...field}
                                            onBlur={() => trigger(field.name)}
                                        />
                                    </Form.Item>
                                )}
                            />
                        </div>

                        <div>
                            <Controller
                                control={control}
                                name={`stages.${index}.se_stage.final_game_number`}
                                render={({ field, fieldState }) => (
                                    <Form.Item
                                        validateStatus={getFormStatus(
                                            fieldState?.error?.message,
                                        )}
                                        help={fieldState?.error?.message}
                                        layout="vertical"
                                        label="Количество игр серии в суперфинале"
                                    >
                                        <Input
                                            prefix="BO"
                                            type="number"
                                            min={1}
                                            max={10}
                                            step={2}
                                            size={"large"}
                                            style={{ width: "fit-content" }}
                                            {...field}
                                            onBlur={() => trigger(field.name)}
                                        />
                                    </Form.Item>
                                )}
                            />
                        </div>
                    </>
                )}
                {stageType === BRACKETS_TYPES.SWISS && (
                    <div>
                        <Controller
                            control={control}
                            name={`stages.${index}.swiss_stage.stage_type`}
                            render={({ field, fieldState }) => (
                                <Form.Item
                                    layout={"vertical"}
                                    label="Тип швейцарки"
                                    validateStatus={getFormStatus(
                                        fieldState?.error?.message,
                                    )}
                                    help={fieldState?.error?.message}
                                >
                                    <Radio.Group
                                        optionType="button"
                                        buttonStyle="solid"
                                        size={"large"}
                                        style={{ width: "100%" }}
                                        className={s.radioWrapper}
                                        {...field}
                                    >
                                        <Radio
                                            className={s.radio}
                                            disabled={true}
                                            value={SWISS_TYPES.SWISS_CLASSIC}
                                        >
                                            <p className={s.optionText}>
                                                Классическая {"\n"}
                                            </p>
                                            <span className={s.optionSubText}>
                                                один победитель
                                            </span>
                                        </Radio>
                                        <Tooltip
                                            title={
                                                "Режим доступен в многоэтапном турнире"
                                            }
                                        >
                                            <Radio
                                                className={s.radio}
                                                value={SWISS_TYPES.SWISS_50_50}
                                                disabled={true}
                                            >
                                                <p className={s.optionText}>
                                                    50/50 {"\n"}
                                                </p>
                                                <span
                                                    className={s.optionSubText}
                                                >
                                                    отсев половины участников
                                                </span>
                                            </Radio>
                                        </Tooltip>
                                        <Tooltip
                                            title={
                                                "Режим доступен в многоэтапном турнире - вам нужно обязательно добавить еще один этап"
                                            }
                                        >
                                            <Radio
                                                className={s.radio}
                                                disabled={isOnlySwissPlaying}
                                                value={SWISS_TYPES.SWISS_MANUAL}
                                            >
                                                <p className={s.optionText}>
                                                    Произвольная {"\n"}
                                                </p>
                                                <span
                                                    className={s.optionSubText}
                                                >
                                                    произвольное кол-во W и L
                                                </span>
                                            </Radio>
                                        </Tooltip>
                                    </Radio.Group>
                                </Form.Item>
                            )}
                        />
                        {isWildcardAvailable && (
                            <Controller
                                control={control}
                                name={`stages.${index}.swiss_stage.add_intermediate`}
                                render={({ field }) => (
                                    <Form.Item
                                        style={{ marginTop: 8 }}
                                        label={"Дополнительно"}
                                        layout={"vertical"}
                                    >
                                        <Flex align={"center"} gap={8}>
                                            <div>
                                                <Switch
                                                    {...field}
                                                    defaultChecked={field.value}
                                                    checked={field.value}
                                                />
                                            </div>
                                            <div>
                                                <Typography.Text
                                                    style={{
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    Добавить промежуточный этап
                                                </Typography.Text>
                                                <br />
                                                <Typography.Text>
                                                    Может использоваться для
                                                    добора игроков для
                                                    заполнения сетки DE
                                                </Typography.Text>
                                            </div>
                                        </Flex>
                                    </Form.Item>
                                )}
                            />
                        )}
                    </div>
                )}
            </Flex>
        </div>
    );
};
