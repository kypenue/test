"use client";
import { Col, Radio, RadioChangeEvent, Row, Tabs } from "antd";
import { useState } from "react";
import { ContentCard } from "@/components/ContentCard";
import { TournamentsList } from "@/components/TournamentsList";
import { BlockedUsers } from "@/components/BlockedUsers";

const items = [
    {
        value: "active",
        label: "Активные",
    },
    {
        value: "completed",
        label: "Завершенные",
    },
];

const tabs = [
    {
        key: "tournaments",
        label: "Турниры",
    },
    {
        key: "black_list",
        label: "Черный список",
    },
];

const TournamentsPage = () => {
    const [activeKey, setActiveKey] = useState("tournaments");
    const [activeStatus, setActiveStatus] = useState("active");

    const handleChange = (e: RadioChangeEvent) => {
        setActiveStatus(e.target.value);
    };

    const handleChangeTab = (key: string) => {
        setActiveKey(key);
    };

    return (
        <ContentCard title={"Управление турнирами"}>
            <Row>
                <Col span={24}>
                    <Tabs
                        defaultActiveKey="tournaments"
                        items={tabs}
                        activeKey={activeKey}
                        onChange={handleChangeTab}
                    />
                    {activeKey === "tournaments" && (
                        <>
                            <Radio.Group
                                options={items}
                                value={activeStatus}
                                buttonStyle={"solid"}
                                optionType={"button"}
                                size={"large"}
                                onChange={handleChange}
                            />
                            <TournamentsList
                                isActive={activeStatus === "active"}
                            />
                        </>
                    )}
                    {activeKey === "black_list" && <BlockedUsers />}
                </Col>
            </Row>
        </ContentCard>
    );
};

export default TournamentsPage;
