import { Tag, Tooltip } from "antd";
import s from "@/components/SwissRating/SwissRating.module.scss";
import { SeriesCardSmall } from "@/components/SeriesCard/SeriesCardSmall";
import { InnerSeries } from "@/shared/types/models/Tournament";

interface GamerStatusProps {
    series: InnerSeries;
    tournamentId: string;
}

export const GamerStatus = ({ series, tournamentId }: GamerStatusProps) => {
    const letter = series?.result_status ? series?.result_status[0] : "";
    const color =
        letter === "W" ? "green" : letter === "L" ? "volcano" : "cyan";
    return (
        <Tooltip
            color={"#22195A"}
            overlayClassName={s.tooltip}
            title={
                <SeriesCardSmall
                    href={`/tournaments/${tournamentId}/series/${series?.id}`}
                    type={"series"}
                    homeTeam={null}
                    guestTeam={null}
                    homePlayerAccount={series.gamer1}
                    guestPlayerAccount={series.gamer2}
                    homePlayerMatchResult={series.gamer1_score}
                    guestPlayerMatchResult={series.gamer2_score}
                    matches={series.matches}
                    isSmall={true}
                />
            }
        >
            <Tag style={{ width: 26 }} color={color}>
                {letter}
            </Tag>
        </Tooltip>
    );
};
