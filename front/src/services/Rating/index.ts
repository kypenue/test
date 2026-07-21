import { Api } from "@/services/api";
import { RatingRequest, RatingResponse } from "@/services/Rating/rating.model";

const BASE_URL = `/accounts`;

const RatingService = Api.enhanceEndpoints({
    addTagTypes: [],
}).injectEndpoints({
    endpoints: (build) => ({
        getLeaderboard: build.query<RatingResponse, RatingRequest>({
            query: ({ page = 1, per_page = 100, ...rest }) => ({
                url: `${BASE_URL}/leaderboard`,
                params: {
                    page,
                    per_page,
                    ...rest,
                },
                method: "GET",
            }),
        }),
    }),
});

export const { useGetLeaderboardQuery } = RatingService;
