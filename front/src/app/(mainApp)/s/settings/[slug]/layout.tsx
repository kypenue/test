"use client";
import { Layout, Menu, type MenuProps, Spin, Typography } from "antd";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import { useSelectedMenu } from "@/shared/hooks/useSelectedMenu";
import { usePathname, useRouter } from "next/navigation";
import { useIsSpaceOwner } from "@/shared/hooks/useIsSpaceOwner";
import { useGetCommunityByIdQuery } from "@/services/Communities/community";
import { FormatPainterOutlined } from "@ant-design/icons";

const SpaceSettingsLayout = ({
    children,
    params: { slug },
}: Readonly<{
    children: ReactNode;
    params: {
        slug: string;
    };
}>) => {
    const router = useRouter();
    const { isOwner, isLoading: isLoadingSpaceOwner } = useIsSpaceOwner(slug);
    const { currentData: community, isLoading: isCommunityLoading } =
        useGetCommunityByIdQuery({
            communityId: slug,
        });
    const isLoading = isCommunityLoading || isLoadingSpaceOwner;
    const menuItems = useMemo(
        () => [
            {
                key: "description",
                icon: <FormatPainterOutlined />,
                label: "Описание",
            },
        ],
        [],
    );

    const defaultSelectedMenu = useSelectedMenu(menuItems);
    const [selectedMenu, setSelectedMenu] =
        useState<string>(defaultSelectedMenu);

    const handleMenuSelect: MenuProps["onClick"] = ({ key }) => {
        router.push(`/s/settings/${slug}/${key}`);
        setSelectedMenu(key);
    };

    useEffect(() => {
        if (!isLoadingSpaceOwner && !isOwner) {
            router.replace("/s");
        }
    }, [isOwner, isLoadingSpaceOwner]);

    return (
        <Layout
            style={{
                overflowY: "hidden",
            }}
        >
            <Layout.Sider collapsible={true} width={200}>
                <Typography.Title
                    style={{
                        textAlign: "center",
                        padding: "24px 0 12px",
                    }}
                    level={4}
                >
                    {isLoading ? <Spin /> : community?.title}
                </Typography.Title>
                <Menu
                    mode="inline"
                    defaultSelectedKeys={[selectedMenu]}
                    selectedKeys={[selectedMenu]}
                    style={{ height: "100%", borderRight: 0 }}
                    items={menuItems}
                    onClick={handleMenuSelect}
                />
            </Layout.Sider>
            <Layout
                style={{
                    margin: 24,
                }}
            >
                {isLoading ? <Spin /> : children}
            </Layout>
        </Layout>
    );
};

export default SpaceSettingsLayout;
