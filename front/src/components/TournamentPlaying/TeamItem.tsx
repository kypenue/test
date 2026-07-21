import { useMemo } from "react";
import { Typography } from "antd";
import type { ProfileTeam } from "@/services/Teams/teams.model";

import { TeamLogo } from "./TeamLogo";

import s from "./TournamentPlaying.module.scss";

export interface TeamItemProps {
    teams: Array<ProfileTeam>;
}

export const TeamItem = ({ teams }: TeamItemProps) => {
    const currentTeams = useMemo(() => {
        if (teams.length) {
            return teams
                .filter((team) => team.available_places !== null)
                .sort(
                    (a, b) =>
                        (b.available_places ?? 0) - (a.available_places ?? 0),
                );
        }
        return [];
    }, [teams]);

    return (
        <div className={s.teamContainer}>
            {!!currentTeams.length &&
                currentTeams.map((team) => (
                    <div className={s.teamSlot}>
                        <TeamLogo team={team} size={20} />
                        <Typography.Text>{team?.name}</Typography.Text>&nbsp;
                        {team.available_places === 0 ? (
                            <Typography.Text>Заполнена</Typography.Text>
                        ) : (
                            <Typography.Text>
                                <span>⏳</span> Осталось:{" "}
                                {team?.available_places}
                            </Typography.Text>
                        )}
                    </div>
                ))}
        </div>
    );
};
