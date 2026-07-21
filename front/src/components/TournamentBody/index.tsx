import { ContentCard } from "@/components/ContentCard";
import { Skeleton, Tabs } from "antd";
import { TournamentInformation } from "@/components/TournamentInformation";
import { TournamentRegulations } from "@/components/TournamentRegulations";
import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import TournamentParticipants from "@/components/TournamentParticipants";
import { TournamentSeries } from "@/components/TournamentSeries";
import { MyGames } from "@/components/MyGames";
import {
    useGetTournamentByIdQuery,
    useGetTournamentRegulationsQuery,
} from "@/services/Tournament/tournament";
import { TabsProps } from "antd/es/tabs";
import { createQueryString } from "@/shared/lib/createQueryString";
import { ForecastBetRating } from "@/components/ForecastBetRating";
import { useRoutedTabs } from "@/shared/hooks/useRoutedTabs";

const tabItems = [
    {
        key: "about",
        children: <TournamentInformation />,
        label: "О турнире",
    },
    {
        key: "regulation",
        children: <TournamentRegulations />,
        label: "Регламент",
    },
    {
        key: "participants",
        children: <TournamentParticipants />,
        label: "Участники",
        disabled: false,
    },
    {
        key: "brackets",
        children: <TournamentSeries />,
        label: "Турнирная сетка",
        disabled: false,
    },
    {
        key: "series",
        children: <MyGames />,
        label: "Мои игры",
        disabled: false,
    },
    {
        key: "forecast_rating",
        children: <ForecastBetRating />,
        label: "Рейтинг поддержки",
        disabled: false,
    },
];
export const TournamentBody = () => {
    const { tournamentId } = useParams<{ tournamentId: string }>();

    const { currentData, isLoading } = useGetTournamentByIdQuery({
        id: tournamentId,
    });

    useGetTournamentRegulationsQuery({
        id: tournamentId,
    });

    const availableTabs = useMemo(
        () =>
            tabItems.reduce(
                (acc, curr) => {
                    if (
                        (curr.key === "about" || curr.key === "/") &&
                        !currentData?.rules_info
                    ) {
                        return acc;
                    }
                    if (curr.key === "regulation" && !currentData?.regulation) {
                        return acc;
                    }
                    if (
                        currentData?.registration_status !== 3 &&
                        (curr.key === "series" ||
                            curr.key === "forecast_rating")
                    ) {
                        return acc;
                    }
                    return (acc ?? []).concat(curr);
                },
                [] as TabsProps["items"],
            ),
        [currentData],
    );

    const { activeKey, handleTabChange } = useRoutedTabs({
        tabs: availableTabs,
        fallbackTab: "about",
        searchParamName: "tournament_tab",
    });

    return (
        <ContentCard>
            {availableTabs && !isLoading && (
                <Tabs
                    onChange={handleTabChange}
                    activeKey={activeKey}
                    items={availableTabs}
                />
            )}
            {isLoading && (
                <div>
                    <Skeleton.Button block={true} />
                    <br />
                    <br />
                    <Skeleton />
                </div>
            )}
        </ContentCard>
    );
};
