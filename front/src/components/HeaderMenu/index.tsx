import {
    Avatar,
    Button,
    Col,
    Divider,
    Drawer,
    Dropdown,
    Flex,
    Layout,
    Menu,
    MenuProps,
    Row,
} from "antd";
import React, { useMemo } from "react";
import Link from "next/link";
import Logo from "../../../public/logo.svg";
import { getHeaderProfileMenu } from "@/components/HeaderMenu/getHeaderProfileMenu";
import {
    ApartmentOutlined,
    CloseOutlined,
    DownOutlined,
    MenuOutlined,
    PhoneOutlined,
    PlusOutlined,
    TeamOutlined,
    UserOutlined,
} from "@ant-design/icons";
import clsx from "clsx";
import s from "./style.module.scss";
import { useRouter } from "next/navigation";
import { useLocalStorage, useToggle } from "usehooks-ts";
import {
    useGetCurrentUserQuery,
    useGetProfilePhotoQuery,
} from "@/services/User/user";
import { userMock } from "@/shared/constants/userMock";
import useBreakpoint from "antd/es/grid/hooks/useBreakpoint";
import { useIsVerifiedUser } from "@/shared/hooks/useIsVerifiedUser";
import { IoGameControllerOutline } from "react-icons/io5";
import { FaTelegramPlane } from "react-icons/fa";

const { Header } = Layout;

/** Публичные пункты до/после «Турниры» в макете Figma */
const PUBLIC_NAV_LEAD: { href: string; label: string }[] = [
    { href: "/organizers#supported-games", label: "Игры" },
    { href: "/organizers#stages", label: "Форматы" },
    { href: "/organizers#about", label: "Роли" },
];
const PUBLIC_NAV_TRAIL: { href: string; label: string }[] = [
    { href: "/organizers#pricing", label: "Цены" },
    { href: "/organizers#contact", label: "Поддержка" },
];

/** Порядок в drawer: как в макете + Пространства */
const DRAWER_NAV_LINKS: { href: string; label: string }[] = [
    ...PUBLIC_NAV_LEAD,
    { href: "/tournaments", label: "Турниры" },
    { href: "/s", label: "Пространства" },
    ...PUBLIC_NAV_TRAIL,
];

export const profileMenuItemsUtil: MenuProps["items"] = [
    {
        key: "/panel",
        icon: <UserOutlined />,
        label: <Link href={"/panel"}>Мой профиль</Link>,
    },
    // {
    //     key: "/panel/secure",
    //     icon: <LockOutlined />,
    //     label: <Link href={"/panel/secure"}>Безопасность</Link>,
    // },
    {
        key: "/panel/games",
        icon: <IoGameControllerOutline />,
        label: <Link href={"/panel/games"}>Игровые аккаунты</Link>,
    },
    {
        key: "/panel/teams",
        icon: <TeamOutlined />,
        label: <Link href={"/panel/teams"}>Справочник команд</Link>,
    },
    {
        key: "/panel/telegram",
        icon: <PhoneOutlined />,
        label: <Link href={"/panel/telegram"}>Telegram</Link>,
    },
    { type: "divider" },
    {
        key: "/panel/tournaments",
        icon: <ApartmentOutlined />,
        label: <Link href={"/panel/tournaments"}>Турниры</Link>,
    },
];

export const HeaderMenu = () => {
    const [isDrawerOpen, toggleDrawerOpen, setIsDrawerOpen] = useToggle();
    const { md, lg } = useBreakpoint();
    const isDesktop = !!lg;
    const isTablet = !!md && !lg;
    const isMobile = !md;
    const {
        currentData: user,
        isLoading,
        isUninitialized,
    } = useGetCurrentUserQuery();

    const { isActive, isVerified } = useIsVerifiedUser();

    const router = useRouter();
    const [token, _setToken, removeToken] = useLocalStorage("token", "", {
        deserializer: (v) => v,
    });

    const { currentData: photo } = useGetProfilePhotoQuery();

    const profileMenu = useMemo(() => {
        return getHeaderProfileMenu(
            router.replace,
            removeToken,
            user?.role ?? 0,
        );
    }, [user, router.replace, removeToken]);

    const isTokenAvailable = !!token;

    const tournamentMenuItems: MenuProps["items"] = useMemo(
        () => [
            {
                key: "tournaments-all",
                label: <Link href="/tournaments">Все турниры</Link>,
            },
            {
                key: "spaces",
                label: <Link href="/s">Пространства</Link>,
            },
        ],
        [],
    );

    const closeDrawer = () => setIsDrawerOpen(false);

    const drawerPublicNav = (
        <div className={s.drawerNav}>
            {DRAWER_NAV_LINKS.map(({ href, label }) => (
                <Link
                    key={href}
                    href={href}
                    className={s.drawerNavLink}
                    onClick={closeDrawer}
                >
                    {label}
                </Link>
            ))}
        </div>
    );

    const menuToggleIcon = isDrawerOpen ? <CloseOutlined /> : <MenuOutlined />;
    const menuToggleLabel = isDrawerOpen ? "Закрыть меню" : "Меню";

    const profileTrigger = photo ? (
        <Avatar
            src={<img src={photo as unknown as string} alt="avatar" />}
        />
    ) : (
        <Avatar icon={<UserOutlined />} />
    );

    return (
        <Header className={s.header}>
            <div
                className={clsx(
                    s.inner,
                    isDesktop && s.innerDesktop,
                    isTablet && s.innerTablet,
                    isMobile && s.innerMobile,
                )}
            >
                {isMobile && (
                    <div className={s.mobileLeading}>
                        <Button
                            type="text"
                            className={s.mobileMenuToggle}
                            onClick={toggleDrawerOpen}
                            icon={menuToggleIcon}
                            aria-label={menuToggleLabel}
                        />
                    </div>
                )}

                <Link
                    href="/"
                    className={clsx(s.logoLink, isMobile && s.logoCenterMobile)}
                >
                    <Logo alt="CUPLY" height={32} />
                </Link>

                {isDesktop && (
                    <nav className={s.nav} aria-label="Основное меню">
                        {PUBLIC_NAV_LEAD.map(({ href, label }) => (
                            <Link key={href} href={href} className={s.navLink}>
                                {label}
                            </Link>
                        ))}
                        <Dropdown
                            menu={{ items: tournamentMenuItems }}
                            trigger={["click"]}
                            placement="bottomLeft"
                        >
                            <button
                                type="button"
                                className={s.navDropdownTrigger}
                                aria-haspopup="menu"
                            >
                                Турниры{" "}
                                <DownOutlined style={{ fontSize: 10 }} />
                            </button>
                        </Dropdown>
                        {PUBLIC_NAV_TRAIL.map(({ href, label }) => (
                            <Link key={href} href={href} className={s.navLink}>
                                {label}
                            </Link>
                        ))}
                    </nav>
                )}

                <div className={s.actions}>
                    {!isLoading &&
                        !isUninitialized &&
                        (isDesktop ? (
                            isTokenAvailable ? (
                                <Flex align="center" gap={16}>
                                    {isActive && isVerified && (
                                        <Button
                                            size="large"
                                            type="dashed"
                                            className={s.tournamentButton}
                                            icon={<PlusOutlined />}
                                            href="/tournaments/create"
                                        >
                                            Создать турнир
                                        </Button>
                                    )}
                                    <Dropdown
                                        menu={{ items: profileMenu }}
                                        className={s.profile}
                                        placement="bottomLeft"
                                    >
                                        {profileTrigger}
                                    </Dropdown>
                                </Flex>
                            ) : (
                                <Button className={s.loginButton} href="/auth">
                                    Войти
                                </Button>
                            )
                        ) : isTokenAvailable ? (
                            <Dropdown
                                menu={{ items: profileMenu }}
                                className={s.profile}
                                placement="bottomLeft"
                            >
                                {profileTrigger}
                            </Dropdown>
                        ) : (
                            <Button className={s.loginButton} href="/auth">
                                Войти
                            </Button>
                        ))}
                    {isTablet && (
                        <Button
                            type="text"
                            className={s.tabletMenuBtn}
                            onClick={toggleDrawerOpen}
                            icon={menuToggleIcon}
                            aria-label={menuToggleLabel}
                        />
                    )}
                </div>
            </div>

            <Drawer
                rootClassName={s.drawerDocked}
                classNames={{ body: s.drawerBody }}
                title={null}
                closable={false}
                onClose={closeDrawer}
                open={isDrawerOpen}
                placement="left"
                width={320}
                destroyOnClose={false}
            >
                <>
                    {drawerPublicNav}
                    {!isLoading && !isUninitialized && isTokenAvailable && (
                        <>
                            <Divider />
                            <Row
                                style={{ marginBottom: 16 }}
                                align="middle"
                                gutter={8}
                            >
                                <Col>
                                    <Avatar
                                        shape="square"
                                        size="large"
                                        icon={
                                            <img
                                                src={photo ?? userMock.avatar}
                                                alt=""
                                            />
                                        }
                                    />
                                </Col>
                                <Col>
                                    <strong>{user?.username}</strong>
                                </Col>
                            </Row>
                            <Menu
                                mode="inline"
                                className={s.menu}
                                items={profileMenu}
                                onClick={closeDrawer}
                            />
                        </>
                    )}
                    <div
                        className={clsx(
                            s.drawerFooter,
                            !(isActive && isVerified) && s.drawerFooterTelegramOnly,
                        )}
                    >
                        {isActive && isVerified && (
                            <Button
                                type="primary"
                                className={s.drawerCta}
                                icon={<PlusOutlined />}
                                href="/tournaments/create"
                                onClick={closeDrawer}
                            >
                                Создать турнир
                            </Button>
                        )}
                        <a
                            className={s.drawerTelegram}
                            href="https://t.me/cuply_support_bot"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Telegram поддержка"
                        >
                            <FaTelegramPlane size={22} />
                        </a>
                    </div>
                </>
            </Drawer>
        </Header>
    );
};
