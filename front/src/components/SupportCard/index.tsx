"use client";

import Image from "next/image";
import Link from "next/link";
import s from "./style.module.scss";

export const SupportCard = () => {
    return (
        <section className={s.card} aria-label="Поддержка">
            <div className={s.content}>
                <p className={s.kicker}>Остались вопросы?</p>
                <h2 className={s.title}>Cuply-team рядом</h2>
                <p className={s.subtitle}>Обращайтесь по любым вопросам</p>
                <Link className={s.cta} href="/organizers#contact">
                    Обратиться в поддержку
                </Link>
            </div>

            <div className={s.art} aria-hidden>
                <Image
                    src="/icons/support.svg"
                    alt=""
                    fill
                    className={s.img}
                    sizes="(max-width: 768px) 100vw, 420px"
                />
            </div>
        </section>
    );
};

