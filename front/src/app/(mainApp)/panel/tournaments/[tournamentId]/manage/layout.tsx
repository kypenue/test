"use client";

import { TournamentManagementTabs } from "@/components/TournamentManagementTabs";
import { ContentCard } from "@/components/ContentCard";
import { useGetTournamentByIdQuery } from "@/services/Tournament/tournament";

interface TournamentManagementLayoutProps {
    children: React.ReactNode;
    params: { tournamentId: string };
}

const TournamentManagementLayout = ({
    children,
    params,
}: TournamentManagementLayoutProps) => {
    const { currentData } = useGetTournamentByIdQuery({
        id: params.tournamentId,
    });
    return (
        <ContentCard
            isBackButtonEnabled={true}
            backHref={"/panel/tournaments"}
            title={currentData?.name}
        >
            <TournamentManagementTabs id={params.tournamentId} />
            {children}
        </ContentCard>
    );
};

export default TournamentManagementLayout;
