import * as yup from "yup";
import dayjs, { Dayjs } from "dayjs";
import { REGISTRATION_TYPES } from "@/shared/constants/tournament";
import { BRACKETS_TYPES } from "@/shared/constants/bracketsTypes";

const wildcardStageSchema = yup
    .object()
    .shape({
        game_number: yup
            .number()
            .required("Введите количество игр в раунде")
            .oneOf([1, 3, 5, 7, 9, 11], "Выберите нечетное число")
            .max(11, "Максимальное число игр - 11")
            .typeError("Введите число"),
    })
    .nullable();

const swissStageSchema = yup
    .object()
    .shape({
        stage_type: yup.string().required("Выберите тип"),
        add_intermediate: yup.boolean(),
        intermediate_type: yup
            .string()
            .required("Необходимо выбрать промежуточный этап WildCard"),
    })
    .nullable();

const doubleEliminationStageSchema = yup
    .object()
    .shape({
        game_number: yup
            .number()
            .required("Введите количество игр в раунде")
            .oneOf([1, 3, 5, 7, 9, 11], "Выберите нечетное число")
            .max(11, "Максимальное число игр - 11")
            .typeError("Введите число"),
        final_game_number: yup
            .number()
            .oneOf([1, 3, 5, 7, 9, 11], "Выберите нечетное число")
            .max(11, "Максимальное число игр - 11")
            .required("Введите количество игр в финале")
            .typeError("Введите число"),
        winner_bracket_advantage: yup.boolean(),
    })
    .nullable();

const singleEliminationStageSchema = yup
    .object()
    .shape({
        game_number: yup
            .number()
            .required("Введите количество игр в раунде")
            .oneOf([1, 3, 5, 7, 9, 11], "Выберите нечетное число")
            .max(11, "Максимальное число игр - 11")
            .typeError("Введите число"),
        final_game_number: yup
            .number()
            .oneOf([1, 3, 5, 7, 9, 11], "Выберите нечетное число")
            .max(11, "Максимальное число игр - 11")
            .required("Введите количество игр в финале")
            .typeError("Введите число"),
        winner_bracket_advantage: yup.boolean(),
    })
    .nullable();

const stagesSchema = yup.object().shape({
    stage_type: yup
        .string<keyof typeof BRACKETS_TYPES>()
        .required("Укажите тип этапа"),
    order_number: yup.number(),
    se_stage: singleEliminationStageSchema,
    swiss_stage: swissStageSchema,
    de_stage: doubleEliminationStageSchema,
    league_stage: yup.object().nullable(),
    wildcard_stage: wildcardStageSchema,
});

export const tournamentSchema = yup
    .object({
        game_id: yup.string().trim().required("Выберите игру"),
        community_id: yup.string().trim(),
        name: yup
            .string()
            .min(2, "Минимум 2 символа")
            .max(50, "Не больше 50 символов")
            .required("Введите имя"),
        participants_number: yup
            .number()
            .positive("Введите положительное число")
            .min(3, "Минимальное число участников - 3")
            .typeError("Введите число")
            .nullable(),

        min_age: yup
            .number()
            .positive("Введите положительное число")
            .nullable()
            .required("Введите возраст")
            .typeError("Введите число"),

        should_limit_participants: yup.boolean(),
        platforms: yup.array().of(yup.number()).required("Выберите платформу"),
        registration_type: yup
            .string()
            .oneOf([REGISTRATION_TYPES.MANUAL, REGISTRATION_TYPES.REGISTRATION])
            .required("Регистрация обязательна"),
        teams_used: yup.boolean(),
        stages: yup.array().of(stagesSchema),
        registration_dates: yup
            .array()
            .of(
                yup
                    .mixed<Dayjs>()
                    .test(
                        "dayjs",
                        "Выбрана некорректная дата",
                        function validate(value) {
                            if (!value) {
                                return true;
                            }
                            return dayjs.isDayjs(value);
                        },
                    )
                    .required("Укажите дату"),
            )
            .length(2)
            .required("Укажите даты"),
        tournament_dates: yup
            .array()
            .of(
                yup
                    .mixed<Dayjs>()
                    .test(
                        "dayjs",
                        "Выбрана некорректная дата",
                        function validate(value) {
                            if (!value) {
                                return true;
                            }
                            return dayjs.isDayjs(value);
                        },
                    )
                    .required("Укажите дату"),
            )
            .length(2)
            .required("Укажите даты"),
    })
    .required();

export type TournamentSchema = yup.InferType<typeof tournamentSchema>;
export type DoubleEliminationStageSchema = yup.InferType<
    typeof doubleEliminationStageSchema
>;
export type SwissStageSchema = yup.InferType<typeof swissStageSchema>;
export type StageSchema = yup.InferType<typeof stagesSchema>;
