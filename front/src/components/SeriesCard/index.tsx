import s from "./SeriesCard.module.scss";
import { Col, Row, Tooltip, Typography } from "antd";
import { clsx } from "clsx";
//import { SeriesMock } from "@/components/SeriesCard/mock";
import { CompetitionScore } from "@/components/CompetitionScore";
import useBreakpoint from "antd/es/grid/hooks/useBreakpoint";
import {
    MatchPlayerModel,
    MatchPlayerResultModel,
    MatchPlayerTeamModel,
} from "@/shared/types/models/Series";
import { CSSProperties, useMemo } from "react";
import _, { isNumber, isString } from "lodash";
import { SeriesCardTeamLeft } from "@/components/SeriesCard/SeriesCardTeam/SeriesCardTeamLeft";
import { SeriesCardTeamRight } from "@/components/SeriesCard/SeriesCardTeam/SeriesCardTeamRight";
import { isAllowedToWriteScore } from "@/shared/lib/isAllowedToWriteScore";
import { useIsFullViewOnSeriesAllowed } from "@/shared/hooks/useIsFullViewOnSeriesAllowed";
import { useRoleInMatch } from "@/shared/hooks/useRoleInSeries";
import Link from "next/link";
import {
    InnerSeries,
    SERIES_STATUSES,
    SERIES_STATUSES_TEXT,
} from "@/shared/types/models/Tournament";
import { STATUS_MAP, STATUS_MAP_EMOJI } from "@/shared/constants/mathes";
import { getSeriesScore } from "@/components/SeriesCard/getSeriesScore";
import { useParams } from "next/navigation";
import { useGetTournamentByIdQuery } from "@/services/Tournament/tournament";

//@ts-nocheck

export interface SeriesCardProps {
    type: "series" | "match";
    disabled?: boolean;
    live?: boolean;
    href?: string;
    homeTeam: MatchPlayerTeamModel | null;
    guestTeam: MatchPlayerTeamModel | null | undefined;
    homePlayerAccount: MatchPlayerModel | undefined;
    guestPlayerAccount: MatchPlayerModel | undefined;
    homePlayerMatchResult?: number | MatchPlayerResultModel;
    guestPlayerMatchResult?: number | MatchPlayerResultModel;
    status?: number | keyof typeof SERIES_STATUSES;
    isScoreEditable?: boolean;
    onChange?: (
        homeScore: number | undefined,
        guestScore: number | undefined,
    ) => void;
    index?: number;
    matches?: InnerSeries["matches"] | null;
    isSmall?: boolean;
    tournamentId?: string;
    styles?: CSSProperties;
    showInitials?: boolean;
}

export const SeriesCard = ({
    disabled,
    type,
    live,
    href,
    isScoreEditable,
    onChange,
    homeTeam,
    guestTeam,
    homePlayerMatchResult,
    guestPlayerMatchResult,
    homePlayerAccount,
    guestPlayerAccount,
    status,
    index,
    matches,
    isSmall,
    tournamentId: tournamentIdProp,
    styles,
    showInitials = false,
}: SeriesCardProps) => {
    const { tournamentId } = useParams<{ tournamentId: string }>();
    const { xs, sm, md } = useBreakpoint();
    const isMobile = isSmall || ((xs || sm) && !md);

    const tournamentIdentifier = tournamentId || tournamentIdProp || "";

    const { data: tournamentData, isLoading: isLoadingTournament } =
        useGetTournamentByIdQuery({
            id: tournamentIdentifier,
        });

    const isFullView = useIsFullViewOnSeriesAllowed(
        homePlayerAccount,
        guestPlayerAccount,
    );

    const { isAdmin, isTournamentOrganizer, isTournamentModerator } =
        useRoleInMatch({
            homePlayerId: homePlayerAccount?.id ?? 0,
            guestPlayerId: guestPlayerAccount?.id,
        });

    const getScore = useMemo(() => {
        return getSeriesScore(
            homePlayerMatchResult,
            guestPlayerMatchResult,
            isNumber(status) ? status : undefined,
            matches,
        );
    }, [homePlayerMatchResult, guestPlayerMatchResult, status, matches]);

    const match = `игра ${isNumber(index) ? `#${index + 1}` : ""}`;

    const isSingleMatch = Array.isArray(matches) && matches.length === 1;

    const isStatusShown = status || isSingleMatch;

    // console.log(
    //     isAllowedToWriteScore(isNumber(status) ? status : 8) && isFullView,
    //     tournamentData && tournamentData.lifecycle_status < 5,
    //     isAdmin,
    //     !!isTournamentOrganizer,
    //     !!isTournamentModerator,
    // );

    return (
        <div
            className={clsx(s.card, { [s.disabled]: disabled })}
            style={styles}
            data-card
        >
            <Row className={s.heading} justify={"space-between"}>
                <Col>
                    <Typography.Text style={{ opacity: 0.6 }}>
                        {type === "series" ? (
                            "серия"
                        ) : href ? (
                            <Link href={href}>{match}</Link>
                        ) : (
                            match
                        )}
                    </Typography.Text>
                </Col>
                <Col>
                    <Row justify={"center"} gutter={[8, 8]}>
                        {live && (
                            <Col className={s.liveIconWrapper}>
                                <div className={s.circle} />
                            </Col>
                        )}
                        {isStatusShown && (
                            <Col>
                                {status &&
                                    isNumber(status) &&
                                    STATUS_MAP[status]}
                                {status &&
                                    isString(status) &&
                                    SERIES_STATUSES_TEXT[status]}
                                {!status && isSingleMatch && (
                                    <Tooltip
                                        title={STATUS_MAP[matches[0].status]}
                                    >
                                        {STATUS_MAP_EMOJI[matches[0].status]}
                                    </Tooltip>
                                )}
                            </Col>
                        )}
                    </Row>
                </Col>
            </Row>
            <Row gutter={[16, 16]} justify={"space-between"}>
                <Col xs={{ order: 1 }} md={{ span: 8 }}>
                    {homePlayerAccount && (
                        <SeriesCardTeamLeft
                            team={homeTeam}
                            isMobile={isMobile}
                            playerAccount={homePlayerAccount}
                            isFullView={isFullView}
                            videoLink={
                                _.isObject(homePlayerMatchResult)
                                    ? homePlayerMatchResult?.video_link
                                    : ""
                            }
                            showInitials={showInitials}
                        />
                    )}
                </Col>
                <Col
                    style={{ display: "flex", justifyContent: "center" }}
                    xs={{ order: 3, span: 24 }}
                    md={{ order: 2, span: 8 }}
                >
                    <CompetitionScore
                        defaultGuestScore={getScore ? getScore[1] : undefined}
                        defaultHomeScore={getScore ? getScore[0] : undefined}
                        href={href}
                        isDisabled={!isScoreEditable}
                        isAllowedToWriteScore={
                            (isAllowedToWriteScore(
                                isNumber(status) ? status : 8,
                            ) &&
                                isFullView &&
                                tournamentData &&
                                tournamentData.lifecycle_status < 5) ||
                            isAdmin ||
                            !!isTournamentOrganizer ||
                            !!isTournamentModerator
                        }
                        status={isNumber(status) ? status : undefined}
                        onChange={onChange}
                    />
                </Col>

                <Col xs={{ order: 2 }} md={{ order: 3, span: 8 }}>
                    {guestPlayerAccount && (
                        <SeriesCardTeamLeft
                            team={guestTeam}
                            isMobile={isMobile}
                            playerAccount={guestPlayerAccount}
                            isFullView={isFullView}
                            videoLink={
                                _.isObject(guestPlayerMatchResult)
                                    ? guestPlayerMatchResult?.video_link
                                    : ""
                            }
                            showInitials={showInitials}
                        />
                        // <SeriesCardTeamRight
                        //     team={guestTeam}
                        //     playerAccount={guestPlayerAccount}
                        //     isMobile={isMobile}
                        //     isFullView={isFullView}
                        //     videoLink={
                        //         _.isObject(guestPlayerMatchResult)
                        //             ? guestPlayerMatchResult?.video_link
                        //             : ""
                        //     }
                        // />
                    )}
                </Col>
            </Row>
        </div>
    );
};
