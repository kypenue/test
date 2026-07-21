import { Col, Row } from "antd";
import { Participant } from "@/shared/types/models/Tournament";
import { countriesList } from "@/shared/constants/countries";

import { PlatformIcon } from "@/components/PlatformIcon";

import s from "./TournamentPlaying.module.scss";

export interface ParticipantItemProps {
    account: Participant;
    style?: object;
}

export const ParticipantItem = ({ account, style }: ParticipantItemProps) => {
    const flag = countriesList.filter(
        (country) => country?.value === account.user.country,
    );

    return (
        <div style={style}>
            <Row justify={"space-between"} align={"middle"}>
                <Col span={8}>{account.login}</Col>
                <Col>
                    <PlatformIcon platformName={account.platform.name} />
                </Col>
                {!!flag.length && (
                    <Col span={10}>
                        <Row
                            gutter={[8, 0]}
                            align={"middle"}
                            style={{ textAlign: "left" }}
                        >
                            <Col>
                                <div className={s.country}>
                                    <img src={flag[0]?.flag} />
                                </div>
                            </Col>
                            <Col>{account.user.city}</Col>
                        </Row>
                    </Col>
                )}
            </Row>
        </div>
    );
};
