import { MessageInstance } from "antd/es/message/interface";
import { SerializedError } from "@reduxjs/toolkit";
import { BadRequestResponse } from "@/services/Auth/user.model";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { isNull } from "lodash";

export const getErrorMessage = (
    error: BadRequestResponse | FetchBaseQueryError | SerializedError | null,
    message: MessageInstance,
    content?: string,
) => {
    console.log(error);
    if (!error) {
        return message.error({
            content,
        });
    }

    if ("data" in error && error.data) {
        if (
            // @ts-ignore ts mistake
            "detail" in error?.data &&
            typeof error.data.detail === "object"
        ) {
            if (!isNull(error.data.detail) && "reason" in error?.data.detail) {
                return message.error({
                    content: `${error.data.detail.reason}`,
                });
            }
            if (!isNull(error.data.detail) && "msg" in error?.data.detail) {
                return message.error({
                    content: `${error.data.detail.msg}`,
                });
            }
            if (
                Array.isArray(error.data.detail) &&
                error.data.detail.length > 0
            ) {
                return message.error({
                    content: `${error.data.detail[0].msg}`,
                });
            }
        }
        // @ts-ignore ts mistake
        if ("detail" in error?.data && typeof error.data.detail === "string") {
            message.error({ content: `${error.data.detail}` });
        }
    }
};
