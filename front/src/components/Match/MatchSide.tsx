import { Score, Side, Team } from "@/components/Match/styles";
import { TeamLogo } from "@/components/TournamentPlaying/TeamLogo";
import { CountryFlag } from "@/components/CountryFlag";
import React, { memo, useCallback } from "react";
import { MatchType } from "@g-loot/react-tournament-brackets/dist/esm";
import { ParticipantType } from "@g-loot/react-tournament-brackets/dist/esm/types";
import s from "./Match.module.scss";
import clsx from "clsx";

interface MatchSideProps {
    hovered: boolean;
    won: boolean;
    text?: string;
    party: ParticipantType;
    match?: MatchType;
    onMatchClick?: (args: {
        match: MatchType;
        topWon: boolean;
        bottomWon: boolean;
        event: React.MouseEvent<HTMLAnchorElement, MouseEvent>;
    }) => void;
    onPartyClick?: (party: ParticipantType, partyWon: boolean) => void;
    onMouseEnter: (partyId: string | number) => void;
    onMouseLeave: () => void;
}

export const MatchSide = memo(
    ({ hovered, party, won, onMouseEnter, onMouseLeave }: MatchSideProps) => {
        const handleOnMouseEnterTop = useCallback(() => {
            onMouseEnter(party?.id);
        }, [onMouseEnter, party?.id]);

        return (
            <Side
                onMouseEnter={handleOnMouseEnterTop}
                onMouseLeave={onMouseLeave}
                won={won}
                hovered={hovered}
            >
                <Team>
                    {party?.name && (
                        <div className={s.participant}>
                            <div className={s.logo_wrapper}>
                                {party?.team && (
                                    <TeamLogo team={party?.team} size={20} />
                                )}
                                {party?.participant_num && (
                                    <p className={clsx(s.name, s.number)}>
                                        #{party?.participant_num}
                                    </p>
                                )}
                            </div>
                            <div>
                                <p className={s.name}>{party?.name}</p>
                                <div className={s.info}>
                                    <CountryFlag
                                        country={party?.country as string}
                                        width={8}
                                        height={8}
                                    />
                                    <div>
                                        <p className={s.city}>{party?.city}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </Team>
                <Score won={won}> {party?.resultText}</Score>
            </Side>
        );
    },
);
