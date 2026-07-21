import * as yup from "yup";
import { InferType } from "yup";

export const matchSchema = yup
    .object({
        score: yup.array().of(yup.number()).required("Введите счет"),
        video_link: yup
            .string()
            .test(
                "test-link",
                "Введена некорректная ссылка",
                (v) => !v || v?.startsWith("https://"),
            ),
    })
    .required();

export type MatchSchema = InferType<typeof matchSchema>;