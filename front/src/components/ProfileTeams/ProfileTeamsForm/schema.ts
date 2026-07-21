import * as yup from "yup";
import { AccessType } from "@/services/Teams/teams.model";

interface FormProps {
    id: string;
    name: string;
    access_type: AccessType;
    image_id: number;
    game_id: number;
}

export const schema = yup.object({
    name: yup.string().required(),
    access_type: yup.string<AccessType>().required(),
    image_id: yup.number().required(),
    game_id: yup.number().required(),
});
