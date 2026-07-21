import { useSubscriptionLevel } from "@/shared/hooks/useSubscriptionLevel";

export const useAvailableTournamentCreationOptions = () => {
    const { isFullTournamentCreator } = useSubscriptionLevel();

    return {
        isUnlimitedParticipantsAvailable: isFullTournamentCreator,
        availableAmountOfParticipants: isFullTournamentCreator ? Infinity : 16,
        availableAmountOfActiveTournaments: isFullTournamentCreator
            ? Infinity
            : 1,
        availableAmountOfStagesInTournament: isFullTournamentCreator
            ? Infinity
            : 1,
    };
};
