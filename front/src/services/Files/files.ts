import { Api as api } from "../api";

export const addTagTypes = ["FILES"] as const;
const filesApi = api
    .enhanceEndpoints({
        addTagTypes,
    })
    .injectEndpoints({
        endpoints: (build) => ({
            getFileById: build.query<void, { id: string }>({
                query: ({ id }) => ({ url: `/uploads/files/static/${id}` }),
            }),
            uploadFile: build.mutation<
                any, //TournamentRegisterResponse,
                FormData
            >({
                query: (fromData) => {
                    return {
                        url: `/uploads/files`,
                        method: "POST",
                        body: fromData,
                        formData: true,
                    };
                },
            }),
            uploadTournamentFile: build.mutation<
                any, //TournamentRegisterResponse,
                FormData
            >({
                query: (fromData) => {
                    return {
                        url: `/uploads/other-files`,
                        method: "POST",
                        body: fromData,
                        formData: true,
                    };
                },
            }),
        }),
        overrideExisting: false,
    });
export { filesApi };

export const { useUploadFileMutation, useUploadTournamentFileMutation } =
    filesApi;
