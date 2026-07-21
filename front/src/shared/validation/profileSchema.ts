import * as yup from "yup";
import { InferType } from "yup";

export const profileSchema = yup
    .object({
        email: yup
            .string()
            .trim()
            .email("Некорректный формат почты")
            .min(2, "Минимум 2 символа")
            .max(70, "Не больше 70 символов")
            .required("Введите email"),
        name: yup
            .string()
            .min(2, "Минимум 2 символа")
            .max(50, "Не больше 50 символов")
            .required("Введите имя"),
        surname: yup
            .string()
            .trim()
            .min(2, "Минимум 2 символа")
            .max(50, "Не больше 50 символов")
            .required("Введите фамилию"),
        birth_date: yup.string().required("Введите дату рождения"),
        username: yup
            .string()
            .min(5, "Минимум 5 символов")
            .max(20, "Не больше 20 символов")
            .required("Введите ник"),
    })
    .required();

export type ProfileSchema = InferType<typeof profileSchema>;

export const panelProfileSchema = yup
    .object({
        city: yup.string(),
        country: yup.string(),
    })
    .concat(profileSchema);

export type PanelProfileSchema = InferType<typeof panelProfileSchema>;
