"use client";
import { Layout } from "antd";
import React from "react";
import PanelMenu from "@/components/PanelMenu";

const { Content } = Layout;
const ProfileLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <Layout style={{ flexWrap: "nowrap" }}>
            <PanelMenu />
            <Layout>
                <Content
                    style={{
                        minHeight: 280,
                        maxWidth: 1440,
                        margin: "0 auto",
                        width: "100%",
                    }}
                >
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
};

export default ProfileLayout;
