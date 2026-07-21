import { MatchPlayerResultModel } from "@/shared/types/models/Series";
import { MatchInSeries } from "@/shared/types/models/Tournament";
import _ from "lodash";

export const getSeriesScore = (
    homePlayerMatchResult: number | MatchPlayerResultModel | undefined,
    guestPlayerMatchResult: number | MatchPlayerResultModel | undefined,
    status: number | undefined,
    matches: MatchInSeries[] | null | undefined,
) => {
    const isAdvantageMatch = status === 10;

    if (isAdvantageMatch) {
        return [1, 0];
    }

    if (matches && matches.length === 1) {
        if ("result" in matches[0] && matches[0].result) {
            return [
                matches[0].result.home_score,
                matches[0].result.guest_score,
            ];
        }
        return;
    }

    const isScoreNumber =
        typeof homePlayerMatchResult === "number" &&
        typeof guestPlayerMatchResult === "number";
    const isHomeScoreObject = _.isObject(homePlayerMatchResult);
    const isGuestScoreObject = _.isObject(guestPlayerMatchResult);

    if (isScoreNumber) {
        return [homePlayerMatchResult, guestPlayerMatchResult];
    }
    if (isHomeScoreObject && _.isNumber(homePlayerMatchResult?.home_score)) {
        return [
            homePlayerMatchResult?.home_score,
            homePlayerMatchResult?.guest_score,
        ];
    }

    if (isGuestScoreObject && _.isNumber(guestPlayerMatchResult?.guest_score)) {
        return [
            guestPlayerMatchResult?.home_score,
            guestPlayerMatchResult?.guest_score,
        ];
    }

    return;
};
