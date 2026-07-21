import * as yup from "yup";
import { InferType } from "yup";

export const passwordSchema = yup
    .object({
        password: yup
            .string()
            .min(8, "Минимум 8 символов")
            .max(30, "Не больше 30 символов")
            .matches(
                /^(?=.*\d)(?=.*[A-Za-zА-Яа-яёЁ]).{8,}$/,
                "Пароль должен содержать одну букву и цифру",
            )
            .required("Введите пароль"),
        repeatPassword: yup
            .string()
            .oneOf([yup.ref("password")], "Пароли не совпадают")
            .required("Введите пароль повторно для подтверждения"),
    })
    .required();

export const panelPasswordSchema = yup
    .object({
        oldPassword: yup.string().required("Введите текущий пароль"),
    })
    .concat(passwordSchema);

export type PasswordSchema = InferType<typeof passwordSchema>;
export type PanelPasswordSchema = InferType<typeof panelPasswordSchema>;