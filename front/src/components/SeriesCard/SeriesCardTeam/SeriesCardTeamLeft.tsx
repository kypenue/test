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
    showInitials?: boolean;
}

export const SeriesCardTeamLeft = ({
    isMobile,
    playerAccount,
    team,
    isFullView,
    videoLink,
    showInitials = false,
}: SeriesCardTeamProps) => {
    return (
        <Row
            align={"middle"}
            gutter={8}
            className={clsx(s.userCard, { [s.column]: isMobile })}
        >
            <Col style={{ alignSelf: "start" }}>
                {/*						// @ts-ignore */}
                {(team || playerAccount.team) && (
                    <TeamLogo
                        size={60}
                        team={playerAccount.team ? playerAccount.team : team!}
                    />
                )}
            </Col>
            <Col>
                <Row
                    id={`user-${playerAccount.user.id?.toString()}`}
                    className={s.playerLeft}
                    gutter={8}
                    align={"middle"}
                >
                    <Col>
                        <Link
                            href={`/account/${playerAccount.user.id}`}
                            className={s.userLink}
                        >
                            <Typography.Title
                                level={4}
                                className={s.loginTitle}
                            >
                                {playerAccount?.login}
                            </Typography.Title>
                            <PlatformIcon
                                fill={"white"}
                                size={isMobile ? 14 : 20}
                                platformName={
                                    playerAccount?.platform?.name ?? ""
                                }
                            />
                        </Link>
                    </Col>
                </Row>
                {showInitials && (
                    <Row>
                        <Typography.Text>
                            {`${playerAccount.user.surname} ${playerAccount.user.name}`}
                        </Typography.Text>
                    </Row>
                )}
                {isFullView && (
                    <Row gutter={8}>
                        <Link
                            href={`https://t.me/${
                                playerAccount?.user?.tg_login?.startsWith("@")
                                    ? playerAccount?.user?.tg_login?.substring(
                                          1,
                                      )
                                    : playerAccount?.user?.tg_login
                            }`}
                            style={{ color: "grey" }}
                        >
                            {" "}
                            <FaTelegramPlane />
                            {playerAccount?.user?.tg_login}
                        </Link>
                    </Row>
                )}
                {videoLink && (
                    <Link target={"_blank"} href={videoLink}>
                        Видео
                    </Link>
                )}
            </Col>
        </Row>
    );
};
