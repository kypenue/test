import { Api as api } from "../api";
import {
    StageRequestArgs,
    StagesRequestArgs,
    TournamentStage,
} from "@/shared/types/models/Stages";
import {
    DrawSwissParticipantsArgs,
    GetSwissStageRatingArgs,
    SwissRatingModel,
} from "@/shared/types/models/Tournament";
import { PaginatedResponse } from "@/shared/types/models/common";

export const addTagTypes = ["STAGE", "STAGES", "SWISS_RATING"] as const;
const tournamentApi = api
    .enhanceEndpoints({
        addTagTypes,
    })
    .injectEndpoints({
        endpoints: (build) => ({
            getStages: build.query<Array<TournamentStage>, StagesRequestArgs>({
                query: ({ tournamentId }) => ({
                    url: `/tournaments/${tournamentId}/stages`,
                }),
                providesTags: ["STAGES"],
            }),
            getStageById: build.query<TournamentStage, StageRequestArgs>({
                query: ({ tournamentId, stageId }) => ({
                    url: `/tournaments/${tournamentId}/stages/${stageId}`,
                }),
                providesTags: ["STAGE"],
            }),
            setNewStageRound: build.mutation<
                Array<TournamentStage>,
                StagesRequestArgs
            >({
                query: ({ tournamentId }) => ({
                    url: `/tournaments/${tournamentId}/stages/start-next-stage`,
                    method: "POST",
                }),
                invalidatesTags: ["STAGES", "STAGE"],
            }),
            startRound: build.mutation<any, DrawSwissParticipantsArgs>({
                query: ({
                    tournamentId,
                    stageId,
                    swissStageId,
                    roundId,
                    stageType,
                    ...body
                }) => ({
                    url: `/tournaments/${tournamentId}/stages/${stageId}/${stageType}/${swissStageId}/rounds/${roundId}/start-round`,
                    method: "POST",
                    body,
                }),
                invalidatesTags: ["STAGES"],
            }),
            endRound: build.mutation<any, DrawSwissParticipantsArgs>({
                query: ({
                    tournamentId,
                    stageId,
                    swissStageId,
                    roundId,
                    stageType,
                    ...body
                }) => ({
                    url: `/tournaments/${tournamentId}/stages/${stageId}/${stageType}/${swissStageId}/rounds/${roundId}/end-round`,
                    method: "POST",
                    body,
                }),
                invalidatesTags: ["STAGES"],
            }),
            getSwissStageRating: build.query<
                PaginatedResponse<Array<SwissRatingModel>>,
                GetSwissStageRatingArgs
            >({
                query: ({
                    tournamentId,
                    stageId,
                    swissStageId,
                    ...params
                }) => ({
                    url: `/tournaments/${tournamentId}/stages/${stageId}/swiss-stages/${swissStageId}/rating`,
                    params,
                    method: "GET",
                }),
                providesTags: ["SWISS_RATING"],
            }),
        }),
        overrideExisting: false,
    });
export { tournamentApi };

export const {
    useGetStagesQuery,
    useGetStageByIdQuery,
    useSetNewStageRoundMutation,
    useEndRoundMutation,
    useStartRoundMutation,
    useGetSwissStageRatingQuery,
} = tournamentApi;
