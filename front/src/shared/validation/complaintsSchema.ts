import * as yup from "yup";
import { InferType } from "yup";

export const complaintsSchema = yup
    .object({
        comment: yup
            .string()
            .min(2, "Минимум 2 символа")
            .max(1024, "Не больше 1024 символов")
            .required("Введите текст жалобы"),
    });

export type ComplaintsSchema = InferType<typeof complaintsSchema>;
