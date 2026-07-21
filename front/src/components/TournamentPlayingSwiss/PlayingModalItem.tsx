import { Col, Typography } from "antd";
import { countriesList } from "@/shared/constants/countries";

import { Participant, ParticipantsModel } from "@/shared/types/models/Tournament";
import { TeamLogo } from './TeamLogo';

import s from "./style.module.scss";

export interface PlayingModalItemProps {
    player: Participant | ParticipantsModel;
    isRight?: boolean;
}

export const PlayingModalItem = ({
    player,
    isRight,
}: PlayingModalItemProps) => {

    const getFlag = (participant: Participant | ParticipantsModel) => {
        const flag = countriesList.filter(
            (country) => country?.value === ("account" in participant ? participant.account.user.country : participant.user.country),
        );

        return flag?.length ? flag[0]?.flag : "";
    };

    const isSwissPlayer = (
        currentPlayer: Participant | ParticipantsModel
    ): currentPlayer is ParticipantsModel => {
        return "account" in currentPlayer;
    };

    const login = isSwissPlayer(player) ? player.account.login : player.login;
    const user = isSwissPlayer(player) ? player.account.user : player.user;

    return (
        <>
            {!isRight && (
                <Col>
                    <Typography.Title level={1} style={{ marginBottom: 0 }}>
                        {login}
                    </Typography.Title>
                    <Typography.Title level={5} style={{ textAlign: "right" }}>
                        {`${user.name} ${user.surname}`}
                    </Typography.Title>
                </Col>
            )}
            <Col>
                {player.team ?
                    <div className={s.glowBlock}>
                        <TeamLogo
                            team={player.team}
                            isLarge
                        />
                    </div> : <div className={s.countryLarge}>
                        <img src={getFlag(player)} />
                    </div>

                }

            </Col>
            {isRight && (
                <Col>
                    <Typography.Title level={1} style={{ marginBottom: 0 }}>
                        {login}
                    </Typography.Title>
                    <Typography.Title level={5} style={{ textAlign: "left" }}>
                        {`${user.name} ${user.surname}`}
                    </Typography.Title>
                </Col>
            )}
        </>
    );
};
