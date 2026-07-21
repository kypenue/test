import React, { useCallback, useState } from "react";
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
import { useToggle } from "usehooks-ts";
import { Col, Row, Select } from "antd";
import { IoClose, IoPencilOutline } from "react-icons/io5";
import {
    useGetTournamentParticipantsQuery,
    useUpdateBracketMutation,
} from "@/services/Tournament/tournament";
import { useGetCurrentUserQuery } from "@/services/User/user";
import { TiTick } from "react-icons/ti";

function MatchDebug({
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
    const { currentData: user } = useGetCurrentUserQuery();
    const { currentData } = useGetTournamentParticipantsQuery({ id: "7" });
    const [isTopEditing, toggleIsTopEditing] = useToggle(false);
    const [topValue, setTopValue] = useState(topParty?.id);
    const [isBottomEditing, toggleIsBottomEditing] = useToggle(false);
    const [bottomValue, setBottomValue] = useState(bottomParty?.id);

    const [updateBracket] = useUpdateBracketMutation();

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

    const isBlogger = user?.role === 2;
    const handleSubmit = () => {
        updateBracket({
            tournamentId: "7",
            seriesId: match?.id?.toString(),
            // @ts-ignore
            player1_id: topValue ?? null,
            // @ts-ignore
            player2_id: bottomValue ?? null,
        }).then((res) => {
            if ("data" in res) {
                isTopEditing && toggleIsTopEditing();
                isBottomEditing && toggleIsBottomEditing();
            }
        });
    };

    const isContradictionInOrder = topParty?.position === 2;

    return (
        <Wrapper style={{ overflow: "visible" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <TopText>{topText}</TopText>
            </div>
            <Anchor>
                {/*
						// @ts-ignore */}
                <StyledMatch
                    style={{
                        overflow: "visible",
                        flexDirection: isContradictionInOrder
                            ? "column-reverse"
                            : "column",
                    }}
                    {...(!isBlogger && { onClick: handleMatchClick })}
                >
                    <Side
                        onMouseEnter={handleOnMouseEnterTop}
                        onMouseLeave={onMouseLeave}
                        won={topWon}
                        style={{ overflow: "visible" }}
                        hovered={topHovered}
                        {...(!isBlogger && {
                            onClick: () => onPartyClick?.(topParty, topWon),
                        })}
                    >
                        <Row>
                            <Col>
                                {!isTopEditing && (
                                    <IoPencilOutline
                                        onClick={toggleIsTopEditing}
                                    />
                                )}
                                {isTopEditing && (
                                    <Row gutter={8}>
                                        <Col>
                                            <IoClose
                                                onClick={toggleIsTopEditing}
                                            />
                                        </Col>
                                        <Col>
                                            <TiTick onClick={handleSubmit} />
                                        </Col>
                                    </Row>
                                )}
                            </Col>
                            <Col>
                                {!isTopEditing && <Team>{topParty?.name}</Team>}
                                {isTopEditing && (
                                    <Select
                                        showSearch
                                        placeholder="Select a person"
                                        filterOption={(e, option) => {
                                            return option?.key
                                                ?.toLowerCase()
                                                .includes(e);
                                        }}
                                        onChange={(e, option) => {
                                            setTopValue(e);
                                        }}
                                    >
                                        {currentData?.payload?.map((item) => (
                                            <Select.Option
                                                value={item.account.id}
                                                key={item.account.login}
                                            >
                                                {item.account.login}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                )}
                            </Col>
                        </Row>
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
                        <Row>
                            <Col>
                                {!isBottomEditing && (
                                    <IoPencilOutline
                                        onClick={toggleIsBottomEditing}
                                    />
                                )}
                                {isBottomEditing && (
                                    <Row gutter={8}>
                                        <Col>
                                            <IoClose
                                                onClick={toggleIsBottomEditing}
                                            />
                                        </Col>
                                        <Col>
                                            <TiTick onClick={handleSubmit} />
                                        </Col>
                                    </Row>
                                )}
                            </Col>
                            <Col>
                                {!isBottomEditing && (
                                    <Team>{bottomParty?.name}</Team>
                                )}
                                {isBottomEditing && (
                                    <Select
                                        showSearch
                                        placeholder="Select a person"
                                        filterOption={(e, option) => {
                                            return option?.key
                                                ?.toLowerCase()
                                                .includes(e);
                                        }}
                                        onChange={(e, option) => {
                                            setBottomValue(e);
                                        }}
                                    >
                                        {currentData?.payload?.map((item) => (
                                            <Select.Option
                                                value={item.account.id}
                                                key={item.account.login}
                                            >
                                                {item.account.login}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                )}
                            </Col>
                        </Row>
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

export default MatchDebug;
