"use client";
import { Layout } from "antd";
import React from "react";
import useBreakpoint from "antd/es/grid/hooks/useBreakpoint";
const { Content } = Layout;
const SeriesLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const breakpoints = useBreakpoint();
    return (
        <Layout style={{ alignItems: "center" }}>
            <Content
                style={{
                    margin: breakpoints.xs ? "8px 8px" : "24px 16px",
                    padding: breakpoints.xs ? 8 : 24,
                    minHeight: 280,
                    maxWidth: 1440,
                }}
            >
                {children}
            </Content>
        </Layout>
    );
};

export default SeriesLayout;