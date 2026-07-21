import { API } from "@/shared/constants/api";
import bg from "../../../public/tournament_bg.jpg";

export const getStaticImage = (objectKey?: boolean | string) => {
    return objectKey
        ? `${API.baseUrl}/uploads/files/static/${objectKey}`
        : `${bg.src}`;
};
