import { Button, Col, Flex, Row, Spin, Typography } from "antd";
import dayjs from "dayjs";
import bg from "../../../public/tournament_bg.jpg";
import { useToken } from "@/shared/hooks/useToken";
import {
    useGetTeamsQuery,
    useGetTournamentByIdPersonalInfoQuery,
    useGetTournamentByIdQuery,
} from "@/services/Tournament/tournament";
import s from "./style.module.scss";
import { TeamLogo } from "@/components/TournamentPlaying/TeamLogo";
import { API } from "@/shared/constants/api";
import { useTournamentRole } from "@/shared/hooks/useTournamentRole";
import Link from "next/link";

require("dayjs/locale/ru");

export interface TournamentHeroProps {
    tournamentId: string;
}

export const TournamentHero = ({ tournamentId }: TournamentHeroProps) => {
    const { currentData, isLoading } = useGetTournamentByIdQuery({
        id: tournamentId,
    });
    const { currentData: userData, isLoading: isUserDataLoading } =
        useGetTournamentByIdPersonalInfoQuery({
            id: tournamentId,
        });

    const { currentData: teams, isLoading: isLoadingTeams } = useGetTeamsQuery({
        id: tournamentId,
    });
    const { isTokenAvailable } = useToken();

    const { isTournamentModerator, isTournamentOrganizer } =
        useTournamentRole(tournamentId);

    const GRADIENT =
        "linear-gradient(90deg, rgba(9,0,25,0) 10%, rgba(9,0,25,1)), linear-gradient(180deg, rgba(9,0,25,0) 10%, rgba(9,0,25,1))";

    return (
        <Row
            style={{
                width: "100%",
                height: "50vh",
                position: "relative",
            }}
            align={"middle"}
            justify={"space-evenly"}
        >
            {isLoading && (
                <Row justify={"center"}>
                    <Col span={24}>
                        <Spin />
                    </Col>
                </Row>
            )}
            {currentData && (
                <>
                    <div
                        className={s.hero}
                        style={{
                            background: `${GRADIENT}, url("${currentData.header_image ? `${API.baseUrl}/uploads/files/static/${currentData.header_image?.object_key}` : bg.src}")`,
                        }}
                    />
                    <Col md={10} xs={0}>
                        <div />
                    </Col>
                    <Col xs={24} md={12} className={s.heroTitle}>
                        <Typography.Title>
                            {currentData.name}
                            <Typography.Paragraph>
                                {dayjs(currentData.tournament_start)
                                    .locale("ru")
                                    .format("D MMMM")}{" "}
                                -{" "}
                                {dayjs(currentData.tournament_end)
                                    .locale("ru")
                                    .format("D MMMM")}
                            </Typography.Paragraph>
                        </Typography.Title>

                        {currentData.lifecycle_status === 2 &&
                            currentData.registration_status === 4 && (
                                <div>
                                    <Button
                                        href={
                                            isTokenAvailable
                                                ? `./${tournamentId}/register`
                                                : "/auth"
                                        }
                                        block
                                        style={{ width: "50%", height: 50 }}
                                        size={"large"}
                                        type={"primary"}
                                    >
                                        <Flex vertical={true}>
                                            <p>Зарегистрироваться</p>
                                            <p
                                                style={{
                                                    fontSize: 12,
                                                    opacity: 0.5,
                                                    textAlign: "center",
                                                }}
                                            >
                                                до{" "}
                                                {dayjs(
                                                    currentData.registration_end,
                                                )
                                                    .locale("ru")
                                                    .format("D MMMM")}
                                            </p>
                                        </Flex>
                                    </Button>
                                </div>
                            )}

                        {currentData.registration_status === 1 && (
                            <Typography.Text>
                                🕒 Заявка подана - ожидайте подтверждения
                            </Typography.Text>
                        )}
                        {currentData.registration_status === 2 && (
                            <Typography.Text>
                                ⛔ Заявка отклонена
                            </Typography.Text>
                        )}
                        {currentData.registration_status === 3 && (
                            <>
                                <Typography.Text>
                                    ✅ Вы участвуете в турнире!
                                </Typography.Text>
                                <br />
                                <br />
                                {userData?.participant?.team &&
                                    userData?.participant?.is_team_shown &&
                                    teams && (
                                        <Typography.Text>
                                            <Row align={"middle"} gutter={8}>
                                                <Col>🤝 Ваша команда: </Col>
                                                <Col>
                                                    <strong>
                                                        <Row align={"middle"}>
                                                            <Col>
                                                                <TeamLogo
                                                                    team={
                                                                        userData
                                                                            ?.participant
                                                                            ?.team
                                                                    }
                                                                />
                                                            </Col>
                                                            <Col>
                                                                {
                                                                    userData
                                                                        ?.participant
                                                                        ?.team
                                                                        .name
                                                                }
                                                            </Col>
                                                        </Row>
                                                    </strong>
                                                </Col>
                                            </Row>
                                        </Typography.Text>
                                    )}
                            </>
                        )}
                        <div
                            style={{ display: "flex", gap: 16, marginTop: 24 }}
                        >
                            {(isTournamentModerator ||
                                isTournamentOrganizer) && (
                                <Link
                                    href={`/tournaments/${tournamentId}/settings`}
                                    passHref
                                    legacyBehavior
                                >
                                    <Button
                                        type="text"
                                        icon={"⚙️"}
                                        size="large"
                                    >
                                        Настройки
                                    </Button>
                                </Link>
                            )}
                            {/*{[1, 2, 3, 7].includes(currentData.lifecycle_status) && currentData.teams_used && (currentData.registration_status === 3 || isTournamentModerator || isTournamentOrganizer) && (*/}
                            {/*    <Link href={`/tournaments/${tournamentId}/auction`} passHref legacyBehavior>*/}
                            {/*        <Button type="primary" icon={'🤝'} size="large">*/}
                            {/*            Аукцион*/}
                            {/*        </Button>*/}
                            {/*    </Link>*/}
                            {/*)}*/}
                        </div>
                    </Col>
                </>
            )}
        </Row>
    );
};
