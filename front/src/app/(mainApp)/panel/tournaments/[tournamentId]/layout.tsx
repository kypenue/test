"use client";

import { TournamentManagementTabs } from "@/components/TournamentManagementTabs";
import { ContentCard } from "@/components/ContentCard";

interface TournamentManagementLayoutProps {
    children: React.ReactNode;
    params: { tournamentId: string };
}

const TournamentPanelLayout = ({
    children,
}: TournamentManagementLayoutProps) => {
    return <div>{children}</div>;
};

export default TournamentPanelLayout;
