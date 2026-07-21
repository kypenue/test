import { TournamentListModel } from "@/shared/types/models/Tournament";
import Link from "next/link";
import { Flex, Typography } from "antd";
import { getStaticImage } from "@/shared/lib/getStaticImage";
import dayjs from "dayjs";
import { isTodayBetween } from "@/shared/lib/isTodayBetween";
import { NewCard } from "@/components/NewCard";
import Image from "next/image";
import s from "./style.module.scss";

function gameInitials(name: string): string {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).slice(0, 2).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
}

export interface TournamentCardProps {
    tournament: TournamentListModel;
}

export const TournamentMiniCard = ({ tournament }: TournamentCardProps) => {
    return (
        <div className={s.slideWrapper} key={tournament.id}>

            <NewCard
                style={{ width: "100%" }}
                cover={
                    <div
                        className={s.cover}
                        style={{
                            backgroundImage: `url("${getStaticImage(
                                tournament?.cover_image?.object_key,
                            )}")`,
                        }}
                    >
                        <div className={s.gameBadge}>
                            <div className={s.gameIcon} aria-hidden>
                                {tournament.game.image?.object_key ? (
                                    <Image
                                        src={getStaticImage(
                                            tournament.game.image.object_key,
                                        )}
                                        alt=""
                                        width={64}
                                        height={64}
                                        className={s.gameIconImg}
                                    />
                                ) : (
                                    <span className={s.gameIconInitials}>
                                        {gameInitials(tournament.game.name)}
                                    </span>
                                )}
                            </div>
                            <p className={s.gameName}>{tournament.game.name}</p>
                        </div>
                    </div>
                }
            >
                <Link href={`/tournaments/${tournament.id}`}>
                    <div className={s.dateRow}>
                        <span>
                            {dayjs(tournament.tournament_start).format(
                                "D MMMM",
                            )}{" "}
                            —{" "}
                            {dayjs(tournament.tournament_end).format("D MMMM")}
                        </span>
                        {isTodayBetween(
                            tournament.registration_start,
                            tournament.registration_end,
                        ) && (
                            <Typography.Text type={"success"}>
                                Регистрация открыта
                            </Typography.Text>
                        )}
                    </div>

                    <h3 className={s.tournamentTitle} title={tournament.name}>
                        {tournament.name}
                    </h3>
                    <p
                        className={s.tournamentDesc}
                        title={tournament.description}
                    >
                        {tournament.description}
                    </p>
                </Link>
            </NewCard>

        </div>
    );
};
