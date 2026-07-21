import * as yup from "yup";
import { InferType } from "yup";

export const loginSchema = yup
    .object({
        email: yup.string().required("Введите email"),
        password: yup.string().required("Введите пароль"),
    })
    .required();

export type LoginSchema = InferType<typeof loginSchema>;
