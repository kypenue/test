import React, { useCallback } from "react";
import { Anchor, Line, StyledMatch, TopText, Wrapper } from "./styles";
import { MatchComponentProps } from "@g-loot/react-tournament-brackets/dist/esm";
import s from "./Match.module.scss";
import { MatchSide } from "@/components/Match/MatchSide";
import { BottomSide } from "@/components/Match/BottomSide";

function Match({
    bottomHovered,
    bottomParty,
    bottomText,
    bottomWon,
    match,
    onMatchClick,
    onMouseEnter,
    onMouseLeave,
    onPartyClick,
    topHovered,
    topParty,
    topText,
    topWon,
}: MatchComponentProps) {
    const handleMatchClick = useCallback(
        (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) =>
            onMatchClick?.({
                match,
                topWon,
                bottomWon,
                event,
            }),
        [match, topWon, bottomWon, onMatchClick],
    );

    const isContradictionInOrder = topParty?.position === 2;

    return (
        <Wrapper id={match?.name} className={s.wrapper}>
            <div className={s.topText}>
                <TopText>{match?.name}</TopText>
            </div>
            <Anchor onClick={handleMatchClick}>
                <StyledMatch
                    style={{
                        flexDirection: isContradictionInOrder
                            ? "column-reverse"
                            : "column",
                    }}
                    // @ts-ignore */
                    onClick={handleMatchClick}
                >
                    <MatchSide
                        onMouseEnter={onMouseEnter}
                        onMouseLeave={onMouseLeave}
                        won={topWon}
                        hovered={topHovered}
                        party={topParty}
                    />
                    <Line highlighted={topHovered || bottomHovered} />
                    <MatchSide
                        onMouseEnter={onMouseEnter}
                        onMouseLeave={onMouseLeave}
                        won={bottomWon}
                        hovered={bottomHovered}
                        party={bottomParty}
                    />
                </StyledMatch>
            </Anchor>
            <BottomSide
                nextWinnerName={match?.next_winner_name}
                nextLoserName={match?.next_loser_name}
            />
        </Wrapper>
    );
}

export default Match;
