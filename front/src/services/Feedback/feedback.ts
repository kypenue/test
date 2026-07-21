import { Api as api } from "../api";
import { PolicyModel } from "@/shared/types/models/Base";
import { FeedbackModel } from "@/services/Feedback/feedback.model";

const baseApi = api.injectEndpoints({
    endpoints: (build) => ({
        sendFeedback: build.mutation<void, FeedbackModel>({
            query: (body) => ({
                url: "/feedback/send-feedback",
                method: "POST",
                body,
            }),
        }),
    }),
    overrideExisting: false,
});
export { baseApi };

export const { useSendFeedbackMutation } = baseApi;
