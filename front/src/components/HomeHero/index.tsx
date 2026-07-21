"use client";

import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "antd";
import { useGetGamesQuery } from "@/services/Games/games";
import { getStaticImage } from "@/shared/lib/getStaticImage";
import {
    ALL_GAMES_HREF,
    HERO_BG,
    HERO_SUBTITLE,
    HOME_STATS_PLATES,
} from "./constants";
import s from "./style.module.scss";

function gameInitials(name: string): string {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).slice(0, 2).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
}

export const HomeHero = () => {
    const { data: games, isLoading, isError } = useGetGamesQuery();
    const displayGames = games?.slice(0, 5) ?? [];

    return (
        <section className={s.root} aria-label="Главный баннер">
            <div className={s.wrap}>
                <div className={s.bannerCard}>
                    <div className={s.bannerBg} aria-hidden>
                        <Image
                            src={HERO_BG}
                            alt=""
                            fill
                            className={s.bannerImg}
                            priority
                            sizes="(max-width: 1200px) 100vw, 1200px"
                        />
                    </div>

                    <div className={s.heroMain}>
                        <h1 className={s.title}>
                            Игровая площадка для проведения мероприятий
                        </h1>
                        <p className={s.subtitle}>{HERO_SUBTITLE}</p>

                        {isLoading && (
                            <div className={s.gamesSkeleton}>
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Skeleton.Avatar
                                        key={i}
                                        active
                                        size={64}
                                        shape="circle"
                                    />
                                ))}
                            </div>
                        )}

                        {!isLoading && !isError && displayGames.length > 0 && (
                            <ul className={s.gameCircles}>
                                {displayGames.map((game) => {
                                    const src = game.image?.object_key
                                        ? getStaticImage(game.image.object_key)
                                        : null;

                                    return (
                                        <li
                                            key={game.id}
                                            className={s.gameCircle}
                                            title={game.name}
                                        >
                                            {src ? (
                                                <Image
                                                    src={src}
                                                    alt={game.name}
                                                    width={64}
                                                    height={64}
                                                    className={s.gameImg}
                                                />
                                            ) : (
                                                <span className={s.gameInitials}>
                                                    {gameInitials(game.name)}
                                                </span>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        )}

                        {!isLoading &&
                            (isError || displayGames.length === 0) && (
                                <p className={s.gamesEmpty}>
                                    {isError
                                        ? "Не удалось загрузить список игр."
                                        : "Список игр скоро появится здесь."}
                                </p>
                            )}

                        <Link href={ALL_GAMES_HREF} className={s.cta}>
                            Все игры
                        </Link>
                    </div>
                </div>

                <div className={s.statsBlock}>
                    <div className={s.statsRow}>
                        {HOME_STATS_PLATES.map((item) => (
                            <article key={item.key} className={s.statCard}>
                                <p className={s.statValue}>{item.value}</p>
                                <p className={s.statLabel}>{item.label}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
