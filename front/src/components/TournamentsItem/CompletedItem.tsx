import { Button, Col, Row, Typography } from "antd";
import dayjs from "dayjs";
import { TournamentListModel } from "@/shared/types/models/Tournament";

import s from "./style.module.scss";
import Link from "next/link";
import { TOURNAMENT_LIFECYCLE_MAP } from "@/shared/constants/tournament";
import { ArrowRightOutlined } from "@ant-design/icons";

interface CompletedItemProps {
    tournament: TournamentListModel;
}

export const CompletedItem = ({ tournament }: CompletedItemProps) => {
    const { tournament_start, tournament_end, lifecycle_status } = tournament;

    const currentDates = `${dayjs(tournament_start).format("DD.MM.YY")} - ${dayjs(tournament_end).format("DD.MM.YY")}`;

    return (
        <div className={s.completedTournament}>
            <Row justify="space-between">
                <Col span={12}>
                    <Row gutter={[0, 24]}>
                        <Col span={24}>
                            <Link href={`/tournament/${tournament.id}`}>
                                <p className={s.title}>{tournament.name}</p>
                                <Typography.Text type="secondary">
                                    {TOURNAMENT_LIFECYCLE_MAP[lifecycle_status]}
                                </Typography.Text>
                            </Link>
                        </Col>
                        <Col span={24}></Col>
                    </Row>
                </Col>
                <Col span={12}>
                    <Row gutter={[0, 24]}>
                        <Col span={24} style={{ textAlign: "right" }}>
                            <p className={s.label}>Даты проведения:</p>
                            <p className={s.date}>{currentDates}</p>
                        </Col>
                        <Col span={24} style={{ textAlign: "right" }}>
                            <Button
                                type="primary"
                                className={s.deleteButton}
                                href={`/tournaments/${tournament.id}/settings`}
                                size="large"
                            >
                                Настройки
                                <ArrowRightOutlined />
                            </Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    );
};
