import * as yup from "yup";
import { InferType } from "yup";

export const reglamentSchema = yup
    .object({
        cover_image_id: yup.number().nullable(),
        header_image_id: yup.number().nullable(),
        rules_info: yup.string(),
        regulation: yup.string(),
    })
    .required();

export type ReglamentSchema = InferType<typeof reglamentSchema>;
