"use client";
import { Col, Layout, Row } from "antd";
import { TournamentHero } from "@/components/TournamentHero";
import { TournamentBody } from "@/components/TournamentBody";
import { TournamentShortInfo } from "@/components/TournamentShortInfo";
import s from "./style.module.scss";

const TournamentPage = ({ params }: { params: { tournamentId: string } }) => {
    return (
        <Layout.Content>
            <TournamentHero tournamentId={params.tournamentId} />
            <Layout.Content className={s.body}>
                <Row
                    style={{ width: "100%" }}
                    justify="center"
                    gutter={[0, 16]}
                >
                    <Col span={24}>
                        <TournamentShortInfo
                            tournamentId={params.tournamentId}
                        />
                    </Col>
                    <Col span={24}>
                        <TournamentBody />
                    </Col>
                </Row>
            </Layout.Content>
        </Layout.Content>
    );
};

export default TournamentPage;
