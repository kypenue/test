"use client";
import { Col, Row, theme } from "antd";
import { Content } from "antd/es/layout/layout";

const SettingsPage = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    return (
        <Row>
            <Col span={24}>
                <Content
                    style={{
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    Сменить общую инфу
                </Content>
            </Col>
        </Row>
    );
};

export default SettingsPage;
