"use client";
import { Layout } from "antd";
import React from "react";
import useBreakpoint from "antd/es/grid/hooks/useBreakpoint";
const { Content } = Layout;
const ProfileLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const breakpoints = useBreakpoint();
    return (
        <Layout>
            <Content
                style={{
                    margin: breakpoints.xs ? "8px 8px" : "24px 16px",
                    padding: breakpoints.xs ? 8 : 24,
                    minHeight: 280,
                }}
            >
                {children}
            </Content>
        </Layout>
    );
};

export default ProfileLayout;