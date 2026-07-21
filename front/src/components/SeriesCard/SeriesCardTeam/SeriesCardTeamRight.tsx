import { Col, Row, Typography } from "antd";
import { clsx } from "clsx";
import s from "@/components/SeriesCard/SeriesCard.module.scss";
import { TeamLogo } from "@/components/TournamentPlaying/TeamLogo";
import { PlatformIcon } from "@/components/PlatformIcon";
import Link from "next/link";
import { FaTelegramPlane } from "react-icons/fa";
import {
    MatchPlayerModel,
    MatchPlayerTeamModel,
} from "@/shared/types/models/Series";

export interface SeriesCardTeamProps {
    isMobile: boolean | undefined;
    playerAccount: MatchPlayerModel;
    team: MatchPlayerTeamModel | null | undefined;
    isFullView: boolean;
    videoLink?: string;
}

export const SeriesCardTeamRight = ({
    isMobile,
    playerAccount,
    team,
    isFullView,
    videoLink,
}: SeriesCardTeamProps) => {
    return (
        <Row
            align={"middle"}
            justify={"end"}
            gutter={8}
            className={clsx({ [s.column]: isMobile })}
        >
            <Col
                style={{ textAlign: "end" }}
                xs={{ order: 2 }}
                md={{ order: 1 }}
            >
                <Row className={s.playerRight} gutter={8} align={"middle"}>
                    <Col>
                        <PlatformIcon
                            fill={"white"}
                            size={20}
                            platformName={playerAccount.platform.name}
                        />
                    </Col>
                    <Col>
                        <Link
                            id={`user-${playerAccount.user.id?.toString()}`}
                            href={`/account/${playerAccount.user.id}`}
                        >
                            <Typography.Title
                                level={4}
                                className={s.loginTitle}
                            >
                                {playerAccount.login}
                            </Typography.Title>
                        </Link>
                    </Col>
                </Row>
                {isFullView && (
                    <Row gutter={8}>
                        <Link
                            style={{
                                color: "grey",
                                textAlign: "right",
                                width: "100%",
                            }}
                            href={`https://t.me/${playerAccount.user?.tg_login?.startsWith("@") ? playerAccount.user?.tg_login?.substring(1) : playerAccount.user?.tg_login}`}
                        >
                            <FaTelegramPlane />
                            {playerAccount.user?.tg_login}
                        </Link>
                    </Row>
                )}
                {videoLink && (
                    <Link target={"_blank"} href={videoLink}>
                        Видео
                    </Link>
                )}
            </Col>
            {(team || playerAccount.team) && (
                <Col
                    xs={{ order: 1 }}
                    md={{ order: 2 }}
                    style={{ alignSelf: "end" }}
                >
                    {/*
						// @ts-ignore */}
                    <TeamLogo isLarge={true} size={60} team={playerAccount.team ? playerAccount.team : team} />
                </Col>
            )}
        </Row>
    );
};
