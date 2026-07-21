import { Col, Row, Typography } from "antd";
import { Participant, TeamModel } from "@/shared/types/models/Tournament";
import { countriesList } from "@/shared/constants/countries";

import { PlatformIcon } from "@/components/PlatformIcon";
import { TeamLogo } from "./TeamLogo";

import s from "./style.module.scss";
import clsx from "clsx";

export interface ParticipantItemProps {
    account: Participant;
    team?: TeamModel | null;
    style?: object;
    isReverse?: boolean;
}

export const ParticipantItem = ({
    account,
    team,
    style,
    isReverse,
}: ParticipantItemProps) => {
    const flag = countriesList.filter(
        (country) => country?.value === account.user.country,
    );

    const iconsWidth = 26;

    return (
        <Row
            gutter={[4, 4]}
            align={"middle"}
            className={clsx(isReverse && s.reverse)}
            style={{ textAlign: "left", ...style }}
        >
            {team && (
                <Col>
                    <TeamLogo team={team} />
                </Col>
            )}
            <Col>
                <Row gutter={8}>
                    <Col xs={24}>
                        <Row align={"middle"} className={s.playerWrapper}>
                            <Col style={{ width: iconsWidth }}>
                                <PlatformIcon
                                    platformName={account.platform.name}
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                    }}
                                />
                            </Col>
                            <Col className={s.playerLogin}>{account.login}</Col>
                        </Row>
                    </Col>
                    {!!flag.length && (
                        <Col xs={24}>
                            <Row
                                gutter={[8, 0]}
                                align={"middle"}
                                className={s.countryWrapper}
                            >
                                <Col style={{ width: iconsWidth }}>
                                    <div className={s.country}>
                                        <img src={flag[0]?.flag} />
                                    </div>
                                </Col>
                                <Col>
                                    <Typography.Text type={"secondary"}>
                                        {" "}
                                        {account.user.city}
                                    </Typography.Text>
                                </Col>
                            </Row>
                        </Col>
                    )}
                </Row>
            </Col>
        </Row>
    );
};
