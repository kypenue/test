import * as yup from "yup";
import { InferType } from "yup";
import { profileSchema } from "@/shared/validation/profileSchema";
import { passwordSchema } from "@/shared/validation/passwordSchema";

export const registrationSchema = yup
    .object({
        agreement: yup
            .boolean()
            .required(
                "Необходимо принять правила обработки персональных данных.",
            )
            .oneOf(
                [true],
                "Необходимо принять правила обработки персональных данных.",
            ),
    })
    .concat(profileSchema)
    .concat(passwordSchema);

export type RegistrationSchema = InferType<typeof registrationSchema>;
