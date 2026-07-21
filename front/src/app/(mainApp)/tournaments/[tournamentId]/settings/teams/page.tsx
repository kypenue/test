"use client";

import { useState } from "react";
import { Tabs } from "antd";
import { ApprovedParticipants } from "./components/ApprovedParticipants";
import { TeamsList } from "./components/TeamsList";

const TeamsPage = ({ params }: { params: { tournamentId: string } }) => {
    const [activeTab, setActiveTab] = useState("participants");

    const tabItems = [
        {
            key: "participants",
            label: "Участники",
            children: <ApprovedParticipants tournamentId={params.tournamentId} />,
        },
        {
            key: "teams",
            label: "Список команд",
            children: <TeamsList />,
        },
    ];

    return (
            <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                items={tabItems}
            />
    );
};

export default TeamsPage; 