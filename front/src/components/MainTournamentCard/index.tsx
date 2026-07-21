import { Button, Col, Flex, Row, Tag, Typography } from "antd";
import s from "./style.module.scss";
import dayjs from "dayjs";
import GameIcon from "../../../public/icons/game-controller.svg";
import IdCardIcon from "../../../public/icons/identification-card.svg";
import PlatformIcon from "../../../public/icons/platform.svg";
import { CalendarOutlined } from "@ant-design/icons";
import { TournamentListModel } from "@/shared/types/models/Tournament";
import { getStaticImage } from "@/shared/lib/getStaticImage";
import { isTodayBetween } from "@/shared/lib/isTodayBetween";

interface MainTournamentCardProps {
    tournament: TournamentListModel;
    isMini?: boolean;
}

export const MainTournamentCard = ({
    tournament,
    isMini,
}: MainTournamentCardProps) => {
    const {
        id,
        name,
        tournament_start,
        tournament_end,
        lifecycle_status,
        registration_status,
        game_id,
        min_age,
        cover_image,
        game,
        platforms,
    } = tournament;

    return (
        <div
            className={`${s.card} ${isMini ? `${s["card--mini"]}` : ""}`}
            style={{
                background: `url("${getStaticImage(cover_image?.object_key)}")`,
            }}
        >
            <div>
                <Typography.Title className={s.title}>{name}</Typography.Title>
                <Flex
                    style={{ flexDirection: "column" }}
                    justify={"left"}
                    wrap={true}
                    gap={8}
                >
                    <Tag
                        color="transparent"
                        icon={<GameIcon height={24} fill={"white"} />}
                        bordered
                        className={s.tag}
                    >
                        {game.name}
                    </Tag>
                    <Tag
                        color="transparent"
                        icon={<IdCardIcon height={24} fill={"white"} />}
                        bordered
                        className={s.tag}
                    >
                        От {min_age} лет
                    </Tag>
                    <Tag
                        color="transparent"
                        icon={<PlatformIcon height={24} fill={"white"} />}
                        bordered
                        className={s.tag}
                    >
                        {platforms.map(({ name }) => name).join(" / ")}
                    </Tag>
                    <Tag
                        icon={<CalendarOutlined height={24} color={"white"} />}
                        color="transparent"
                        bordered
                        className={s.tag}
                    >
                        {dayjs(tournament_start).format("D MMMM")} —{" "}
                        {dayjs(tournament_end).format("D MMMM")}
                    </Tag>
                </Flex>
            </div>
            {!isMini && (
                <div>
                    <Row
                        justify={"start"}
                        style={{ flexDirection: "column" }}
                        align={"top"}
                        gutter={[16, 16]}
                    >
                        <Col className={s.buttonWrapper} sm={12} xs={24}>
                            <Button
                                block
                                size={"large"}
                                type="primary"
                                href={`/tournaments/${id}`}
                            >
                                Подробнее
                            </Button>
                        </Col>
                        {lifecycle_status === 2 &&
                            registration_status === 4 && (
                                <Col
                                    className={s.buttonWrapper}
                                    sm={12}
                                    xs={24}
                                >
                                    <Button
                                        block
                                        type={"primary"}
                                        size={"large"}
                                        href={`/tournaments/${id}/register`}
                                    >
                                        Зарегистрироваться
                                    </Button>
                                    {isTodayBetween(
                                        tournament.registration_start,
                                        tournament.registration_end,
                                    ) && (
                                        <Typography.Text
                                            style={{
                                                lineHeight: 2,
                                                textAlign: "center",
                                                display: "block",
                                            }}
                                            type={"secondary"}
                                        >
                                            Регистрация открыта
                                        </Typography.Text>
                                    )}
                                </Col>
                            )}
                    </Row>
                </div>
            )}
        </div>
    );
};
