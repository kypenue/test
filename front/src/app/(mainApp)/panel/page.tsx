"use client";
import { Col, Row } from "antd";
import { ContentCard } from "@/components/ContentCard";
import { PanelPersonalForm } from "@/components/PanelPersonalForm";

const ProfilePage = () => {
    return (
        <Row gutter={[24, 24]}>
            <Col span={24}>
                <ContentCard title={"Редактировать информацию о себе"}>
                    <PanelPersonalForm />
                </ContentCard>
            </Col>
        </Row>
    );
};

export default ProfilePage;
