import { SeriesCardProps } from "@/components/SeriesCard";
import { useMemo } from "react";
import { clsx } from "clsx";
import { Col, Row, Typography } from "antd";
import Link from "next/link";
import { getSeriesScore } from "@/components/SeriesCard/getSeriesScore";
import localFont from "next/font/local";
import { djs } from "@/shared/lib/dayjs";
import { isNumber } from "lodash";
import { TeamLogo } from "@/components/TournamentPlaying/TeamLogo";

import s from "@/components/SeriesCard/SeriesCard.module.scss";
import ss from "./SeriesCardSmall.module.css";

const myFont = localFont({
    src: "../../../../public/fonts/scoreboard.ttf",
    variable: "--score-board",
});

export interface SeriesCardSmallProps extends SeriesCardProps {
    currentUserId?: string | null | number;
    isDisabled?: boolean;
    updatedAt?: string;
}

const LOGO_SIZE = 30;

export const SeriesCardSmall = ({
    disabled,
    homePlayerMatchResult,
    guestPlayerMatchResult,
    homePlayerAccount,
    guestPlayerAccount,
    status,
    matches,
    href,
    updatedAt,
}: SeriesCardSmallProps) => {
    const getScore = useMemo(() => {
        return getSeriesScore(
            homePlayerMatchResult,
            guestPlayerMatchResult,
            isNumber(status) ? status : undefined,
            matches,
        );
    }, [homePlayerMatchResult, guestPlayerMatchResult, status, matches]);

    return (
        <Link href={href ?? "#"}>
            <div
                className={clsx(
                    s.card,
                    { [s.disabled]: disabled },
                    s.small,
                    myFont.variable,
                )}
            >
                <Row
                    gutter={[16, 16]}
                    justify={"space-between"}
                    align={"middle"}
                >
                    <Col xs={8}>
                        <Row
                            className={s.playerLeft}
                            gutter={8}
                            align={"middle"}
                        >
                            <Col>
                                <Link
                                    href={`/account/${homePlayerAccount?.user?.id}`}
                                    className={ss.link}
                                >
                                    {homePlayerAccount?.team && (
                                        <TeamLogo
                                            size={LOGO_SIZE}
                                            team={homePlayerAccount.team}
                                        />
                                    )}
                                    <Typography.Title
                                        level={4}
                                        className={s.loginTitle}
                                    >
                                        {homePlayerAccount?.login}
                                    </Typography.Title>
                                </Link>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={8}>
                        <Row justify={"center"}>
                            <Col xs={11} className={s.score}>
                                <p
                                    style={{ textAlign: "right" }}
                                    className={s.scoreText}
                                >
                                    {Array.isArray(getScore)
                                        ? getScore[0]
                                        : "—"}
                                </p>
                            </Col>
                            <Col xs={2}>
                                <p
                                    className={s.scoreText}
                                    style={{
                                        textAlign: "center",
                                    }}
                                >
                                    :
                                </p>
                            </Col>
                            <Col xs={11} className={s.score}>
                                <p
                                    className={s.scoreText}
                                    style={{
                                        padding: "0 4px",
                                    }}
                                >
                                    {Array.isArray(getScore)
                                        ? getScore[1]
                                        : "—"}
                                </p>
                            </Col>
                        </Row>
                    </Col>

                    <Col xs={8}>
                        {guestPlayerAccount && (
                            <Row
                                className={s.playerRight}
                                gutter={8}
                                align={"middle"}
                            >
                                <Col>
                                    <Link
                                        href={`/account/${guestPlayerAccount?.user?.id}`}
                                        className={ss.link}
                                    >
                                        {guestPlayerAccount?.team && (
                                            <TeamLogo
                                                size={LOGO_SIZE}
                                                team={guestPlayerAccount.team}
                                                className={ss.rightCommand}
                                            />
                                        )}
                                        <Typography.Title
                                            level={4}
                                            className={s.loginTitle}
                                        >
                                            {guestPlayerAccount.login}
                                        </Typography.Title>
                                    </Link>
                                </Col>
                            </Row>
                        )}
                    </Col>
                </Row>
                {updatedAt && (
                    <div className={s.date}>
                        {djs(updatedAt).utc().format("D MMMM [в] HH:mm")}
                    </div>
                )}
            </div>
        </Link>
    );
};
