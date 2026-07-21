"use client";

import { Dropdown } from "antd";
import type { MenuProps } from "antd";
import { FaTelegramPlane } from "react-icons/fa";
import useBreakpoint from "antd/es/grid/hooks/useBreakpoint";
import s from "./footerTelegram.module.scss";

const items: MenuProps["items"] = [
    {
        key: "news",
        label: (
            <a
                href="https://t.me/cuplypro"
                target="_blank"
                rel="noopener noreferrer"
            >
                Новости CUPLY
            </a>
        ),
    },
    {
        key: "support",
        label: (
            <a
                href="https://t.me/cuply_support_bot"
                target="_blank"
                rel="noopener noreferrer"
            >
                Техническая поддержка
            </a>
        ),
    },
];

/** Те же ссылки, что у плавающего TelegramButton; вид для футера (белый круг). */
export const FooterTelegramMenu = () => {
    const { xs } = useBreakpoint();

    return (
        <Dropdown
            menu={{ items }}
            trigger={xs ? ["click"] : ["hover"]}
            placement="top"
        >
            <button
                type="button"
                className={s.trigger}
                aria-label="Telegram CUPLY"
                aria-haspopup="menu"
            >
                <FaTelegramPlane className={s.icon} aria-hidden />
            </button>
        </Dropdown>
    );
};
