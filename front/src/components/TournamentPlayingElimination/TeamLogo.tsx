import { TeamModel } from "@/shared/types/models/Tournament";
import { API } from "@/shared/constants/api";

import s from "./style.module.scss";
import { clsx } from "clsx";

export interface TeamLogoProps {
    team: TeamModel | null;
    isLarge?: boolean;
    style?: object;
}

export const TeamLogo = ({
    team,
    isLarge = false,
    style,
}: TeamLogoProps) => {

    return (
        <div
            style={style}
            className={clsx(s.logo, {
                [s["logo--large"]]: isLarge,
                [s.bordered]: isLarge,
            })}
        >
            {team && team.logo?.id ? (
                <div
                    style={{
                        height: isLarge ? 100 : 40,
                        width: isLarge ? 100 : 40,
                        backgroundImage: `url("${API.baseUrl}/uploads/files/static/${team.logo.object_key}")`,
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center center",
                    }}
                />
            ) : (
                <div></div>
            )}
        </div>
    );
};