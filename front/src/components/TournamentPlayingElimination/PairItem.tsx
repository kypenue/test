import { Card, Col, Row, Tooltip } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

import {
    InnerSeries,
    Pairs,
    Participant,
    ParticipantsModel,
} from "@/shared/types/models/Tournament";

import { ParticipantItem } from "./ParticipantItem";

import s from "./style.module.scss";

export interface PairItemProps {
    pair: InnerSeries;
}

dayjs.extend(customParseFormat);

export const PairItem = ({ pair }: PairItemProps) => {
    const getTooltipTitle = (participant: Participant) => {
        if (!participant) {
            return;
        }
        const user = participant.user;
        const name = `${user.name}&nbsp;${user.surname}`;
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
        <Card className={s.teamsCard}>
            <Row justify={"space-between"} align={"middle"}>
                <Col
                    span={11}
                    style={{
                        textAlign: "right",
                    }}
                >
                    <Tooltip title={getTooltipTitle(pair.gamer1)}>
                        <ParticipantItem
                            account={pair.gamer1}
                            // team={pair.gamer1.team}
                        />
                    </Tooltip>
                </Col>
                {pair.gamer2 && (
                    <>
                        <Col>
                            <div className={s.VsBlock}>VS</div>
                        </Col>
                        <Col
                            span={11}
                            style={{
                                textAlign: "right",
                            }}
                        >
                            <Tooltip title={getTooltipTitle(pair.gamer2)}>
                                <ParticipantItem
                                    account={pair.gamer2}
                                    isReverse={true}
                                    // team={pair.gamer2}
                                />
                            </Tooltip>
                        </Col>
                    </>
                )}
            </Row>
        </Card>
    );
};
