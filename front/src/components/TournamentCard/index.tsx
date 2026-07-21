import { TournamentListModel } from "@/shared/types/models/Tournament";
import { getStaticImage } from "@/shared/lib/getStaticImage";
import s from "./style.module.scss";
import { Tag, Typography } from "antd";
import { isTodayBetween } from "@/shared/lib/isTodayBetween";
import { getTournamentDatesString } from "@/shared/lib/getTournamentDatesString";
import Link from "next/link";

export interface TournamentCardProps {
    tournament: TournamentListModel;
}

export const TournamentCard = ({ tournament }: TournamentCardProps) => {
    return (
        <div className={s.cardWrapper}>
            <Link href={`/tournaments/${tournament.id}`}>
                <div className={s.card}>
                    <div
                        className={s.image}
                        style={{
                            background: `url("${getStaticImage(tournament?.cover_image?.object_key)}"), #22195A`,
                        }}
                    ></div>
                    <div className={s.info}>
                        <div>&nbsp;</div>
                        <div>
                            <Typography.Paragraph className={s.upperTitle}>
                                {getTournamentDatesString(
                                    tournament.tournament_start,
                                    tournament.tournament_end,
                                )}
                            </Typography.Paragraph>
                            <Typography.Title className={s.title} level={3}>
                                {tournament.name}
                            </Typography.Title>
                            {isTodayBetween(
                                tournament.registration_start,
                                tournament.registration_end,
                            ) && (
                                <Typography.Text
                                    className={s.bottomTitle}
                                    type={"success"}
                                >
                                    Регистрация открыта <br /> <br />
                                </Typography.Text>
                            )}
                            <Typography.Text className={s.bottomTitle}>
                                {tournament.game.name}
                                {"  "} • {"  "} {tournament.min_age}+ лет
                            </Typography.Text>
                        </div>
                        <div className={s.status}>
                            <div>
                                {tournament.lifecycle_status == 1 && (
                                    <Tag color={"blue"}>скоро</Tag>
                                )}
                                {tournament.lifecycle_status === 2 && (
                                    <Tag color={"success"}>
                                        идет регистрация
                                    </Tag>
                                )}
                                {tournament.lifecycle_status === 3 && (
                                    <Tag color={"cyan"}>
                                        регистрация окончена
                                    </Tag>
                                )}
                                {tournament.lifecycle_status === 4 && (
                                    <Tag color={"warning"}>активен</Tag>
                                )}
                                {tournament.lifecycle_status === 6 && (
                                    <Tag color={"default"}>завершен</Tag>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
};
