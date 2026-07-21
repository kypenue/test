"use client";

import Link from "next/link";
import s from "./style.module.scss";

const MENU_LINKS: { href: string; label: string }[] = [
    { href: "/organizers#supported-games", label: "Игры" },
    { href: "/organizers#stages", label: "Форматы" },
    { href: "/organizers#about", label: "Роли" },
    { href: "/tournaments", label: "Турниры" },
    { href: "/s", label: "Пространства" },
    { href: "/organizers#pricing", label: "Цены" },
    { href: "/organizers#contact", label: "Поддержка" },
];

/** Десктоп: строки как в макете (не сетка 3×N). */
const MENU_DESKTOP_ROWS: { href: string; label: string }[][] = [
    [MENU_LINKS[0], MENU_LINKS[1], MENU_LINKS[2]],
    [MENU_LINKS[3], MENU_LINKS[4]],
    [MENU_LINKS[5], MENU_LINKS[6]],
];

const EXTRA_LINKS: { href: string; label: string }[] = [
    { href: "/cookies-policy", label: "Файлы Cookie" },
    { href: "/personal-policy", label: "Политика конфиденциальности" },
    { href: "/personal-policy", label: "Правила обработки ПД" },
];

const CopyrightBlock = ({ className }: { className?: string }) => (
    <div className={className}>
        <span>Все права защищены.</span>
        <span>© 2024–2025</span>
    </div>
);

export const SiteFooter = () => {
    return (
        <footer className={s.footer}>
            <div className={s.inner}>
                <div className={s.topGrid}>
                    <section className={s.topCol}>
                        <h2 className={s.blockTitle}>Меню</h2>
                        <nav aria-label="Меню подвала">
                            <div className={s.menuDesktop}>
                                {MENU_DESKTOP_ROWS.map((row, rowIndex) => (
                                    <div
                                        key={rowIndex}
                                        className={s.menuDesktopRow}
                                    >
                                        {row.map((item) => (
                                            <Link
                                                key={item.href + item.label}
                                                href={item.href}
                                                className={s.link}
                                            >
                                                {item.label}
                                            </Link>
                                        ))}
                                    </div>
                                ))}
                            </div>
                            <div className={s.menuMobile}>
                                {MENU_LINKS.map((item) => (
                                    <Link
                                        key={`m-${item.href}-${item.label}`}
                                        href={item.href}
                                        className={s.link}
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        </nav>
                    </section>

                    <section className={s.topCol}>
                        <h2 className={s.blockTitle}>Дополнительно</h2>
                        <ul className={s.extraList}>
                            {EXTRA_LINKS.map((item) => (
                                <li key={item.href + item.label}>
                                    <Link
                                        href={item.href}
                                        className={s.link}
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>

                <div className={s.bottomDesktop}>
                    <Link href="/" className={s.brandWrap}>
                        <img
                            src="/footer-cuplypro.svg"
                            alt="CUPLYPRO"
                            className={s.brandImg}
                            width={792}
                            height={109}
                            decoding="async"
                        />
                    </Link>
                    <div className={s.bottomRight}>
                        <CopyrightBlock className={s.copyright} />
                    </div>
                </div>

                <div className={s.bottomMobile}>
                    <CopyrightBlock className={s.copyright} />
                    <Link href="/" className={s.brandWrap}>
                        <img
                            src="/footer-cuplypro.svg"
                            alt="CUPLYPRO"
                            className={s.brandImg}
                            width={792}
                            height={109}
                            decoding="async"
                        />
                    </Link>
                </div>
            </div>
        </footer>
    );
};
