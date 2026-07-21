import { Api as api } from "../api";
import {
    MatchComplaintsRequestArgs,
    SeriesComplaintsRequestArgs,
    CreateComplaintsRequestArgs,
    UpdateComplaintsRequestArgs,
    TournamentComplaintsRequestArgs,
    ComplaintModel,
} from "@/shared/types/models/Complaints";

export const addTagTypes = [
    "COMPLAINTS_MATCH",
    "COMPLAINTS_SERIES",
    "COMPLAINTS_ALL",
] as const;
const complaintsApi = api
    .enhanceEndpoints({
        addTagTypes,
    })
    .injectEndpoints({
        endpoints: (build) => ({
            getComplaintsByMatch: build.query<Array<ComplaintModel>, MatchComplaintsRequestArgs>({
                query: ({ tournamentId, seriesId, matchId, ...params }) => ({
                    url: `/tournaments/${tournamentId}/series/${seriesId}/matches/${matchId}/complaints`,
                    params,
                }),
                transformResponse: (data: ComplaintsResponse) => {
                    return data.payload;
                },
                providesTags: ["COMPLAINTS_MATCH"],
            }),
            getComplaintsBySeries: build.query<Array<ComplaintModel>, SeriesComplaintsRequestArgs>({
                query: ({ tournamentId, seriesId, ...params }) => ({
                    url: `/tournaments/${tournamentId}/series/${seriesId}/complaints`,
                    params,
                }),
                transformResponse: (data: ComplaintsResponse) => {
                    return data.payload;
                },
                providesTags: ["COMPLAINTS_SERIES"],
            }),
            getComplaintsByTournament: build.query<ComplaintsResponse, TournamentComplaintsRequestArgs>({
                query: ({ tournamentId, ...params }) => ({
                    url: `/tournaments/${tournamentId}/complaints`,
                    params,
                }),
                providesTags: ["COMPLAINTS_ALL"],
            }),
            createMatchComplaints: build.mutation<
                any,
                CreateComplaintsRequestArgs
            >({
                query: ({ tournamentId, seriesId, matchId, ...body }) => ({
                    url: `/tournaments/${tournamentId}/series/${seriesId}/matches/${matchId}/complaints`,
                    method: "POST",
                    body,
                }),
                invalidatesTags: ["COMPLAINTS_MATCH", "COMPLAINTS_SERIES", "COMPLAINTS_ALL"],
            }),
            updateMatchComplaints: build.mutation<
                any,
                UpdateComplaintsRequestArgs
            >({
                query: ({ tournamentId, seriesId, matchId, complaintId, ...body }) => ({
                    url: `/tournaments/${tournamentId}/series/${seriesId}/matches/${matchId}/complaints/${complaintId}`,
                    method: "PATCH",
                    body,
                }),
                invalidatesTags: ["COMPLAINTS_MATCH", "COMPLAINTS_SERIES", "COMPLAINTS_ALL"],
            }),
        }),
        overrideExisting: false,
    });
export { complaintsApi };

export interface ComplaintsResponse {
    page: number;
    per_page: number;
    total_pages: number;
    total_count: number;
    payload: Array<ComplaintModel>;
}

export const {
    useCreateMatchComplaintsMutation,
    useGetComplaintsByMatchQuery,
    useGetComplaintsBySeriesQuery,
    useGetComplaintsByTournamentQuery,
    useUpdateMatchComplaintsMutation,
} = complaintsApi;