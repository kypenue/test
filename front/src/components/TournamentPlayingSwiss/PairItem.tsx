import { Card, Col, Row, Tooltip } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

import { Participant, SwissPairModel } from "@/shared/types/models/Tournament";

import { ParticipantItem } from "./ParticipantItem";

import s from "./style.module.scss";
import { isNullOrUndefined } from "util";

export interface PairItemProps {
    pair: SwissPairModel;
    onClick: (pairId: string) => void;
}

dayjs.extend(customParseFormat);

export const PairItem = ({ pair, onClick }: PairItemProps) => {
    const getTooltipTitle = (participant: Participant) => {
        const user = participant.user;

        if (!user) {
            return null;
        }

        const name = `${user.name} ${user.surname}`;
        const age = dayjs(Date.now()).diff(
            dayjs(user.birth_date, "YYYY-MM-DD"),
            "year",
        );

        return (
            <span>
                {name},&nbsp;{age}
            </span>
        );
    };

    return (
        <Card onClick={() => onClick(pair?.id ?? "")} className={s.teamsCard}>
            <Row justify={"space-between"} align={"middle"}>
                <Tooltip title={getTooltipTitle(pair.gamer1)}>
                    <Col
                        span={11}
                        style={{
                            textAlign: "right",
                        }}
                    >
                        <ParticipantItem isLarge={true} participant={{ account: pair.gamer1, team: pair.gamer1.team || null }} />
                    </Col>
                </Tooltip>
                {pair.gamer2 && (
                    <>
                        <Col>
                            <div className={s.VsBlock}>VS</div>
                        </Col>
                        <Tooltip title={getTooltipTitle(pair.gamer2)}>
                            <Col
                                span={11}
                                style={{
                                    textAlign: "right",
                                }}
                            >
                                <ParticipantItem isLarge={true} participant={{ account: pair.gamer2, team: pair.gamer2.team || null }} />
                            </Col>
                        </Tooltip>
                    </>
                )}
            </Row>
        </Card>
    );
};
