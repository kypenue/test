"use client";
import { Col, Layout, Row, theme } from "antd";
import React from "react";

const { Content } = Layout;
const ProfileLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <Layout>
            <Row align={"middle"} justify="center" style={{ height: "100%" }}>
                <Col xs={24} sm={18} lg={12}>
                    <Content
                        style={{
                            margin: "24px 16px",
                            padding: 24,
                            minHeight: 280,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                            height: "fit-content",
                        }}
                    >
                        {children}
                    </Content>
                </Col>
            </Row>
        </Layout>
    );
};

export default ProfileLayout;
