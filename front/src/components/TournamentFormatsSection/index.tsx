"use client";

import Link from "next/link";
import { FORMAT_CARDS, FORMATS_TRY_HREF } from "./constants";
import s from "./style.module.scss";

type TournamentFormatsSectionProps = {
    title: string;
};

export const TournamentFormatsSection = ({
    title,
}: TournamentFormatsSectionProps) => {
    return (
        <section
            className={s.section}
            aria-labelledby="tournament-formats-heading"
        >
            <div className={s.inner}>
                <h2 id="tournament-formats-heading" className={s.heading}>
                    {title}
                </h2>
                <div className={s.grid}>
                    {FORMAT_CARDS.map(({ Icon, ...item }) => (
                        <article key={item.key} className={s.card}>
                            <div className={s.cardHead}>
                                <Icon
                                    className={s.icon}
                                    width={40}
                                    height={40}
                                    aria-hidden
                                />
                                <div className={s.titleBlock}>
                                    <div className={s.titleRow}>
                                        <h3 className={s.cardTitle}>
                                            {item.title}
                                        </h3>
                                        {item.soon && (
                                            <span className={s.badge}>
                                                Скоро
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <p className={s.description}>{item.description}</p>
                            {item.soon ? (
                                <span className={s.ctaMuted}>
                                    Попробовать
                                    <span
                                        className={s.ctaArrow}
                                        aria-hidden
                                    >
                                        →
                                    </span>
                                </span>
                            ) : (
                                <Link
                                    href={FORMATS_TRY_HREF}
                                    className={s.cta}
                                >
                                    Попробовать
                                    <span
                                        className={s.ctaArrow}
                                        aria-hidden
                                    >
                                        →
                                    </span>
                                </Link>
                            )}
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};
