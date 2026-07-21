import {
    useGetSeriesBetStatusQuery,
    useCreateForecastBetMutation,
} from "@/services/Series/series";
import { useCallback, useMemo } from "react";
import { useToken } from "./useToken";
import { BET_STATUSES } from "@/shared/types/models/Series";

interface UseSeriesVotingProps {
    tournamentId: string;
    seriesId: string;
}

interface UseSeriesVotingReturn {
    hasBet: boolean;
    bettedParticipantId: number | undefined;
    isLoading: boolean;
    placeBet: (participantId: number) => Promise<void>;
    isBetButtonDisabled: (participantId: number | undefined) => boolean;
    isBetExpired: boolean;
    isBetAllowed: boolean;
}

export const useSeriesVoting = ({
    tournamentId,
    seriesId,
}: UseSeriesVotingProps): UseSeriesVotingReturn => {
    const { token } = useToken();
    const isAuthenticated = !!token;

    const { data: betStatus, isLoading } = useGetSeriesBetStatusQuery(
        { tournamentId, seriesId },
        { skip: !isAuthenticated || !tournamentId || !seriesId },
    );

    const [triggerBet, { isLoading: isPlacingBet }] =
        useCreateForecastBetMutation();

    const hasBet = useMemo(() => !!betStatus?.bet, [betStatus]);

    const isBetExpired = useMemo(
        () => betStatus?.status === BET_STATUSES.SERIES_ALREADY_PLAYED,
        [betStatus],
    );

    const isBetAllowed = useMemo(
        () =>
            betStatus?.status !== BET_STATUSES.FORECAST_COMPETITION_NOT_ALLOWED,
        [betStatus],
    );

    const bettedParticipantId = useMemo(
        () => betStatus?.bet?.winner.id,
        [betStatus],
    );

    const placeBet = useCallback(
        async (participantId: number) => {
            if (!isAuthenticated || isPlacingBet || !tournamentId || !seriesId)
                return;

            try {
                await triggerBet({
                    tournamentId,
                    seriesId,
                    participantId,
                }).unwrap();
            } catch (error) {
                console.error("Failed to place bet:", error);
                throw error;
            }
        },
        [isAuthenticated, isPlacingBet, seriesId, tournamentId, triggerBet],
    );

    const isBetButtonDisabled = useCallback(
        (participantId: number | undefined) => {
            if (!isAuthenticated) return true;
            if (isLoading || isPlacingBet) return true;
            if (isBetExpired) return true;
            if (hasBet && bettedParticipantId !== participantId) return true;
            return false;
        },
        [hasBet, isAuthenticated, isLoading, isPlacingBet, bettedParticipantId],
    );

    return {
        hasBet,
        bettedParticipantId,
        isLoading,
        placeBet,
        isBetButtonDisabled,
        isBetExpired,
        isBetAllowed,
    };
};
