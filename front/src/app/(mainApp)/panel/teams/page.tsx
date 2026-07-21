"use client";
import { Col, Row } from "antd";
import { ContentCard } from "@/components/ContentCard";
import { View } from "@/components/ProfileTeams/View";

const TeamsPage = () => {
    return (
        <Row>
            <Col span={24}>
                <ContentCard title={"Ваши команды"}>
                    <View />
                </ContentCard>
            </Col>
        </Row>
    );
};

export default TeamsPage;
