import { TeamModel } from "@/shared/types/models/Tournament";
import { API } from "@/shared/constants/api";
import { getStaticImage } from "@/shared/lib/getStaticImage";

import s from "./style.module.scss";
import { clsx } from "clsx";

export interface TeamLogoProps {
    team: Pick<TeamModel, "image"> | null;
    isLarge?: boolean;
    style?: object;
    hasBackground?: boolean;
    size?: number;
    className?: string;
}

export const TeamLogo = ({
    team,
    isLarge = false,
    style,
    hasBackground,
    size,
    className,
}: TeamLogoProps) => {
    const actualSize = size || (isLarge ? 100 : 40);

    return (
        <div
            style={style}
            className={clsx(s.logo, className, {
                [s["logo--large"]]: isLarge,
                [s.bordered]: isLarge && hasBackground,
            })}
        >
            {team && team.image?.object_key ? (
                <div
                    style={{
                        height: actualSize,
                        width: actualSize,
                        backgroundImage: `url("${getStaticImage(team?.image.object_key)}")`,
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center center",
                        borderRadius: "50%",
                    }}
                />
            ) : (
                <div style={{ borderRadius: "50%" }}></div>
            )}
        </div>
    );
};
