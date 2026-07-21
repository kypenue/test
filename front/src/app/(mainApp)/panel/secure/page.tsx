"use client";
import { Col, Row } from "antd";
import { PanelSecurityForm } from "@/components/PanelSecurityForm";
import { ContentCard } from "@/components/ContentCard";

const SecurePage = () => {
    return (
        <Row>
            <Col span={24}>
                <ContentCard title={"Изменение данных безопасности"}>
                    <PanelSecurityForm />
                </ContentCard>
            </Col>
        </Row>
    );
};

export default SecurePage;
