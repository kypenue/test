"use client";
import { Col, Row } from "antd";
import { ContentCard } from "@/components/ContentCard";
import { ProfileUserTop } from "@/components/ProfileUserTop";
import { ProfileTabs } from "@/components/ProfileTabs";
import { ProfileUnverifiedEmailAlert } from "@/components/ProfileUnverifiedEmailAlert";

const AccountPage = ({ params }: { params: { userId: string } }) => {
    return (
        <Row gutter={[24, 24]}>
            <Col span={24}>
                <ProfileUserTop />
            </Col>
            {params.userId === "current" && <ProfileUnverifiedEmailAlert />}
            <Col span={24}>
                <ProfileTabs />
            </Col>
        </Row>
    );
};

export default AccountPage;
