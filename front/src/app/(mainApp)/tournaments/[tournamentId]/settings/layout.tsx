"use client";
import { Layout, Menu, MenuProps, Spin, Tag, theme, Typography } from "antd";
import React, { useMemo, useState } from "react";
import Sider from "antd/es/layout/Sider";
import { useGetTournamentByIdQuery } from "@/services/Tournament/tournament";
import { menuItems } from "@/app/(mainApp)/tournaments/[tournamentId]/settings/menuItems";
import { useSelectedMenu } from "@/shared/hooks/useSelectedMenu";
import { useRouter } from "next/navigation";
import s from "./style.module.scss";

const TournamentSettingsLayout = ({
    children,
    params: { tournamentId },
}: Readonly<{
    children: React.ReactNode;
    params: {
        tournamentId: string;
    };
}>) => {
    const router = useRouter();
    const { currentData: tournament } = useGetTournamentByIdQuery({
        id: tournamentId,
    });
    const availableMenuItems = useMemo(() => {
        if (tournament) {
            const isTeamsAvailable = tournament.teams_used;
            return menuItems.filter((menuItem) => {
                if (menuItem.key === "teams" && !isTeamsAvailable) {
                    return false;
                }
                return true;
            });
        }
        return [];
    }, [tournament]);
    const defaultSelectedMenu = useSelectedMenu(availableMenuItems);
    const [selectedMenu, setSelectedMenu] =
        useState<string>(defaultSelectedMenu);
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const handleMenuSelect: MenuProps["onClick"] = ({ key, keyPath }) => {
        const pagePath = `/tournaments/${tournamentId}/settings/`;
        const path = keyPath.reverse().join("/");
        router.push(`${pagePath}/${path}`);
        setSelectedMenu(key);
    };
    return (
        <Layout
            style={{
                overflowY: "hidden",
            }}
        >
            {tournament ? (
                <>
                    <Sider
                        collapsible={true}
                        width={200}
                        style={{ background: colorBgContainer }}
                    >
                        <Typography.Title
                            style={{
                                textAlign: "center",
                                padding: "24px 0 12px",
                            }}
                            level={4}
                        >
                            {tournament.name}
                            <br />
                            {tournament.community ? (
                                <Tag color={"cyan"}>турнир</Tag>
                            ) : (
                                <Tag color={"yellow"} className={s.tag}>
                                    турнир персональный
                                </Tag>
                            )}
                        </Typography.Title>

                        <Menu
                            mode="inline"
                            defaultSelectedKeys={[selectedMenu]}
                            selectedKeys={[selectedMenu]}
                            style={{ height: "100%", borderRight: 0 }}
                            items={availableMenuItems}
                            onClick={handleMenuSelect}
                        />
                    </Sider>{" "}
                    <Layout
                        style={{
                            margin: 24,
                        }}
                    >
                        {children}
                    </Layout>
                </>
            ) : (
                <Spin />
            )}
        </Layout>
    );
};

export default TournamentSettingsLayout;
