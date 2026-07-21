"use client";

import { ContentCard } from "@/components/ContentCard";

interface TournamentManagementLayoutProps {
    children: React.ReactNode;
    params: { tournamentId: string };
}

const TournamentPanelLayout = ({
    children,
}: TournamentManagementLayoutProps) => {
    return (
        <ContentCard isBackButtonEnabled={true} title={"Калькулятор швейцарки"}>
            {children}
        </ContentCard>
    );
};

export default TournamentPanelLayout;
