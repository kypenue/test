import type { SelectProps } from "antd";
import { useMemo } from "react";
import { useGetProfileGames } from "@/shared/hooks/useGetProfileGames";
import { useGetProfileTeamByIdQuery } from "@/services/Teams";
import { skipToken } from "@reduxjs/toolkit/query";
import { AccessType } from "@/services/Teams/teams.model";
import { useGetCurrentUserGamerAccountsQuery } from "@/services/Games/games";

interface FormProps {
    id: string;
    name: string;
    access_type: AccessType;
    image_id: number | undefined;
    game_id: number | undefined;
}

export const useGetFormData = (teamId?: string) => {
    const { data, isLoading } = useGetProfileTeamByIdQuery(teamId ?? skipToken);
    const { currentData: currentUserAccounts } =
        useGetCurrentUserGamerAccountsQuery({});

    const items: SelectProps["options"] = useMemo(
        () =>
            currentUserAccounts?.payload?.map((item) => ({
                key: item.id,
                value: item.game.id,
                label: item.game.name,
            })),
        [currentUserAccounts],
    );

    const defaultValues: FormProps = useMemo(() => {
        if (teamId && data) {
            return {
                ...data,
                game_id: data.game?.id,
                image_id: data.image?.id,
            };
        }
        return { access_type: "PRIVATE" } as FormProps;
    }, [data]);

    return { items, data, isLoading, defaultValues };
};
