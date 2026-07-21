"use client";
import { Col, Row } from "antd";
import { ContentCard } from "@/components/ContentCard";
import { ConnectTelegram } from "@/components/ConnectTelegram";

const TelegramPage = () => {
    return (
        <Row>
            <Col span={24}>
                <ContentCard title={"Привязать телеграм аккаунт"}>
                    <ConnectTelegram />
                </ContentCard>
            </Col>
        </Row>
    );
};

export default TelegramPage;