import React, { useCallback } from "react";
import {
    Anchor,
    Line,
    Score,
    Side,
    StyledMatch,
    Team,
    TopText,
    Wrapper,
} from "./styles";
import { MatchComponentProps } from "@g-loot/react-tournament-brackets/dist/esm";

function MatchTest({
    bottomHovered,
    bottomParty,
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

    const handleOnMouseEnterTop = useCallback(() => {
        onMouseEnter(topParty?.id);
    }, [onMouseEnter, topParty?.id]);

    const handleOnMouseEnterBottom = useCallback(() => {
        onMouseEnter(bottomParty?.id);
    }, [onMouseEnter, bottomParty?.id]);
    return (
        <Wrapper>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <TopText>{topText}</TopText>
                {
                    <Anchor
                        href={match.href}
                        onClick={(event) =>
                            onMatchClick?.({
                                match,
                                topWon,
                                bottomWon,
                                event,
                            })
                        }
                    >
                        <TopText>
                            {match?.id}, {match?.nextMatchId},{" "}
                            {match?.nextLooserMatchId}
                        </TopText>
                    </Anchor>
                }
            </div>
            <Anchor onClick={handleMatchClick}>
                {/*
						// @ts-ignore */}
                <StyledMatch onClick={handleMatchClick}>
                    <Side
                        onMouseEnter={handleOnMouseEnterTop}
                        onMouseLeave={onMouseLeave}
                        won={topWon}
                        hovered={topHovered}
                        // onClick={() => onPartyClick?.(topParty, topWon)}
                    >
                        <Team>{topParty?.name}</Team>
                        <Score won={topWon}> {topParty?.resultText}</Score>
                    </Side>
                    <Line highlighted={topHovered || bottomHovered} />
                    <Side
                        onMouseEnter={handleOnMouseEnterBottom}
                        onMouseLeave={onMouseLeave}
                        won={bottomWon}
                        hovered={bottomHovered}
                        // onClick={() => onPartyClick?.(bottomParty, bottomWon)}
                    >
                        <Team>{bottomParty?.name}</Team>
                        <Score won={bottomWon}>
                            {bottomParty?.resultText?.toString()}
                        </Score>
                    </Side>
                </StyledMatch>
            </Anchor>

            {/*<BottomText>{bottomText ?? " "}</BottomText>*/}
        </Wrapper>
    );
}

export default MatchTest;
