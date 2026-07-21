import { useGetTournamentByIdQuery } from "@/services/Tournament/tournament";
import { useMemo } from "react";

const INITIAL_STATE = JSON.stringify([{ type: "p", children: [{ text: "" }] }]);

export const usePrepareData = (tournamentId: number) => {
    const { currentData: tournamentData } = useGetTournamentByIdQuery({
        id: tournamentId?.toString(),
    });

    return useMemo(() => {
        if (tournamentData) {
            try {
                if (
                    tournamentData.rules_info === "" &&
                    tournamentData.regulation === ""
                ) {
                    return {
                        regulation: INITIAL_STATE,
                        rules_info: INITIAL_STATE,
                        isMarkdown: false,
                    };
                }
                console.log(JSON.parse(tournamentData?.rules_info));
                console.log(JSON.parse(tournamentData?.regulation));

                return {
                    regulation: tournamentData.regulation || INITIAL_STATE,
                    rules_info: tournamentData.rules_info || INITIAL_STATE,
                    isMarkdown: false,
                };
            } catch (e) {
                console.error(e);
                return {
                    regulation: tournamentData.regulation,
                    rules_info: tournamentData.rules_info,
                    isMarkdown: true,
                };
            }
        }

        return {
            regulation: INITIAL_STATE,
            rules_info: INITIAL_STATE,
            isMarkdown: false,
        };
    }, [tournamentData]);
};
