import s from "@/components/Complaints/style.module.scss";
import {
    useGetMatchesByIdQuery,
    useGetPreviousSeriesOfUsersQuery,
} from "@/services/Series/series";
import { useMemo } from "react";
import { Col, Empty, Skeleton, Typography } from "antd";
import { SeriesCardSmall } from "@/components/SeriesCard/SeriesCardSmall";

export interface PreviousOpponentMatchesProps {
    params: { tournamentId: string; seriesId: string };
}

export const PreviousOpponentMatches = ({
    params: { tournamentId, seriesId },
}: PreviousOpponentMatchesProps) => {
    const { currentData, isLoading } = useGetMatchesByIdQuery({
        tournamentId,
        seriesId,
    });
    const getUserIds = useMemo(() => {
        if (currentData) {
            const user1_id =
                currentData[0]?.home_player_account.user.id?.toString();
            const user2_id =
                currentData[0]?.guest_player_account.user.id?.toString();
            return { user1_id, user2_id };
        }
        return { user1_id: "", user2_id: "" };
    }, [currentData]);
    const { currentData: previousMatches, isLoading: isMatchesLoading } =
        useGetPreviousSeriesOfUsersQuery(getUserIds, {
            skip: !getUserIds?.user1_id,
        });

    const isInfoLoading = isMatchesLoading || isLoading;
    return (
        <div className={s.card}>
            <p className={s.title}>история</p>
            {isInfoLoading && <Skeleton.Input block />}
            {previousMatches && (
                <div>
                    {previousMatches.payload?.length > 0 &&
                        previousMatches.payload.map((series) => (
                            <Col xs={24} key={series.id}>
                                <SeriesCardSmall
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
                            </Col>
                        ))}
                    {previousMatches.payload?.length === 0 && (
                        <Empty
                            imageStyle={{ height: "fit-content" }}
                            image={<Typography.Title>🍃</Typography.Title>}
                            description={"История противостояний отсутствует"}
                        />
                    )}
                </div>
            )}
        </div>
    );
};
