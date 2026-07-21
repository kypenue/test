"use client";
import { Col, Layout, Row, Typography } from "antd";
import React from "react";
import { ContentCard } from "@/components/ContentCard";
const RegisterLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <Layout>
            <Row align={"middle"} justify="center" style={{ height: "100%" }}>
                <Col xs={24} sm={18} lg={12}>
                    <Typography.Title style={{ textAlign: "center" }}>
                        Регистрация на турнир{" "}
                    </Typography.Title>
                    <ContentCard>{children}</ContentCard>
                </Col>
            </Row>
        </Layout>
    );
};

export default RegisterLayout;