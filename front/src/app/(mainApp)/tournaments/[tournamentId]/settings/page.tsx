"use client";

import { ActiveItem } from "@/components/TournamentsItem";
import React from "react";
import { useGetTournamentByIdQuery } from "@/services/Tournament/tournament";
import { Spin } from "antd";

const TournamentSettingsPage = ({
    params: { tournamentId },
}: Readonly<{
    params: {
        tournamentId: string;
    };
}>) => {
    const { currentData: tournament } = useGetTournamentByIdQuery({
        id: tournamentId,
    });
    return (
        <div>
            {tournament ? (
                <ActiveItem
                    isStagesStepperVisible={true}
                    tournament={tournament}
                />
            ) : (
                <Spin />
            )}
        </div>
    );
};

export default TournamentSettingsPage;
