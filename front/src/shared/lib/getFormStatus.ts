import { FormItemProps } from "antd";

export const getFormStatus = (
    errorMessage: string | undefined,
): FormItemProps<any>["validateStatus"] => {
    if (errorMessage) {
        return "error";
    }
    return "";
};
