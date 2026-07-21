import { Col, Row, Tooltip } from "antd";
import { ParticipantModelDraw } from "@/shared/types/models/Tournament";
import { countriesList } from "@/shared/constants/countries";

import { PlatformIcon } from "@/components/PlatformIcon";

import { TeamLogo } from './TeamLogo';

import s from "./style.module.scss";

export interface ParticipantItemProps {
    participant: ParticipantModelDraw;
    isLarge?: boolean;
    style?: object;
}

export const ParticipantItem = ({ participant, style, isLarge }: ParticipantItemProps) => {

    const flag = countriesList.filter(
        (country) => country?.value === participant?.account?.user?.country,
    );

    return (
        <div style={style}>
            <Row justify={"space-between"} align={"middle"}>
                <Col span={participant?.team ? 14 : 8} style={{ fontSize: '12px' }}>
                    <Row align={"middle"} gutter={[8, 0]}>
                        <Col>{participant?.account.login}</Col>
                        {participant?.team &&
                            <Col>
                                <span className={s.countrySmall}>
                                    <img src={flag[0]?.flag} />
                                    <span style={{ fontSize: 10 }}>{participant?.account.user.city}</span>
                                </span>
                            </Col>
                        }
                    </Row>
                </Col>
                <Col span={3}>
                    <Row justify="center" align={"middle"}>
                        <Col>
                            <PlatformIcon
                                size={26}
                                platformName={participant?.account.platform.name}
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                }}
                            />
                        </Col>
                    </Row>
                </Col>
                {!!flag.length && (
                    <Col span={participant?.team ? 6 : 12}>
                        <Row
                            gutter={[8, 0]}
                            align={"middle"}
                            style={{ textAlign: "left" }}
                        >
                            {participant?.team ?
                                <Col>
                                    <Tooltip
                                        title={participant?.team.name}
                                    >
                                        <TeamLogo
                                            team={participant.team}
                                            size={isLarge ? 60 : 35}
                                        />
                                        {/* <Typography.Text>
                                        
                                    </Typography.Text> */}
                                    </Tooltip>
                                </Col>
                                :
                                <>
                                    <Col>
                                        <div className={s.country}>
                                            <img src={flag[0]?.flag} />
                                        </div>
                                    </Col>
                                    <Col style={{ fontSize: '12px' }}>{participant?.account.user.city}</Col>
                                </>
                            }
                        </Row>
                    </Col>
                )}
            </Row>
        </div>
    );
};
