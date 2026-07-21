import { Col, Flex, Row } from "antd";
import type { GamerTournamentsStats } from "@/services/Games/games";
import { Card } from "./Card";

import s from "./TournamentStats.module.scss";

export const TournamentItem = (props: GamerTournamentsStats) => {
    return (
        <Flex vertical gap={8}>
            <Row className={s.item} gutter={[8, 8]}>
                <Col md={6} span={12}>
                    <Card
                        title={"Кол-во игр"}
                        value={props?.matches_count ?? "-"}
                    />
                </Col>
                <Col md={6} span={12} style={{ display: "flex" }}>
                    <Card title={"Победы"} value={props?.wins ?? "-"} />
                </Col>
                <Col md={6} span={12}>
                    <Card title={"Ничьи"} value={props?.draws ?? "-"} />
                </Col>
                <Col md={6} span={12}>
                    <Card title={"Поражения"} value={props?.losses ?? "-"} />
                </Col>
                <Col span={24}>
                    <Card
                        title={"Победы в (%)"}
                        value={`${props.wins_percent}%`}
                    />
                </Col>
            </Row>
            <Row className={s.item} gutter={[8, 8]}>
                <Col sm={12} span={24} style={{ display: "flex" }}>
                    <Card title={"Забито"} value={props?.goals_scored ?? "-"} />
                </Col>
                <Col sm={12} span={24} xs={{ order: 2 }}>
                    <Card
                        title={"Пропущено"}
                        value={props?.goals_conceded ?? "-"}
                    />
                </Col>
                <Col sm={12} span={24} xs={{ order: 1 }}>
                    <Card
                        title={"Кол-во очков за игру (AVG)"}
                        value={props?.avg_goals_scored ?? "-"}
                    />
                </Col>
                <Col sm={12} span={24} xs={{ order: 3 }}>
                    <Card
                        title={"Пропущенных (AVG)"}
                        value={props?.avg_goals_conceded ?? "-"}
                    />
                </Col>
                <Col span={24} xs={{ order: 4 }}>
                    <Card
                        title={"Сухие игры в (%)"}
                        value={`${props.clean_sheets_percent}%`}
                    />
                </Col>
            </Row>
            <Row gutter={[8, 8]}>
                <Col sm={12} span={24}>
                    <Card
                        title={"Крупнейшая победа"}
                        value={props?.biggest_win ?? "-"}
                    />
                </Col>
                <Col sm={12} span={24}>
                    <Card
                        title={"Крупнейшее поражение"}
                        value={props?.biggest_loss ?? "-"}
                    />
                </Col>
            </Row>
        </Flex>
    );
};
