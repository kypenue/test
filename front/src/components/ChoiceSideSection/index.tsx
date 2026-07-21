"use client";

import Image from "next/image";
import Link from "next/link";
import { CHOICE_CARDS } from "./constants";
import s from "./style.module.scss";

export const ChoiceSideSection = () => {
    return (
        <div className={s.grid}>
            {CHOICE_CARDS.map((item) => (
                <article key={item.key} className={s.card}>
                    <div className={s.iconWrap} aria-hidden>
                        <Image
                            src={item.iconSrc}
                            alt=""
                            width={520}
                            height={360}
                            className={s.icon}
                            priority={false}
                        />
                    </div>
                    <h3 className={s.title}>{item.title}</h3>
                    <p className={s.desc}>{item.description}</p>
                    <Link className={s.cta} href={item.href}>
                        {item.ctaLabel}
                    </Link>
                </article>
            ))}
        </div>
    );
};

