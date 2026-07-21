"use client";
import { Col, Row } from "antd";
import { ContentCard } from "@/components/ContentCard";
import { PanelGameAccounts } from "@/components/PanelGameAccounts";

const GamesPage = () => {
    return (
        <Row>
            <Col span={24}>
                <ContentCard title={"Ваши игровые аккаунты"}>
                    <PanelGameAccounts />
                </ContentCard>
            </Col>
        </Row>
    );
};

export default GamesPage;
