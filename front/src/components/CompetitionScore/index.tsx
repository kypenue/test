import { Button, Col, Input, Row } from "antd";
import { useEffect, useState } from "react";
import s from "./style.module.scss";
import { clsx } from "clsx";
import localFont from "next/font/local";

const myFont = localFont({
    src: "../../../public/fonts/scoreboard.ttf",
    variable: "--score-board",
});

export interface CompetitionScoreProps {
    isDisabled?: boolean;
    href?: string;
    defaultHomeScore?: number | undefined;
    defaultGuestScore?: number | undefined;
    onChange?: (
        homeScore: number | undefined,
        guestScore: number | undefined,
    ) => void;
    isAllowedToWriteScore: boolean;
    status?: number;
}

export const CompetitionScore = ({
    isDisabled,
    href,
    defaultHomeScore = undefined,
    defaultGuestScore = undefined,
    onChange,
    isAllowedToWriteScore,
    status,
}: CompetitionScoreProps) => {
    const [homeScore, setHomeScore] = useState<number>();
    const [guestScore, setGuestScore] = useState<number>();
    useEffect(() => {
        if (defaultHomeScore !== undefined && defaultGuestScore !== undefined) {
            setHomeScore(defaultHomeScore);
            setGuestScore(defaultGuestScore);
        }
    }, [defaultHomeScore, defaultGuestScore]);

    useEffect(() => {
        if (onChange) {
            onChange(homeScore, guestScore);
        }
    }, [homeScore, guestScore, onChange]);

    const isAdvantageMatch = status === 10;

    const isFillLinkAvailable =
        href && isAllowedToWriteScore && !isAdvantageMatch;

    return (
        <Row
            className={clsx(s.competitionScore, myFont.variable)}
            gutter={[8, 8]}
        >
            <Col>
                <Row
                    gutter={8}
                    className={s.scoreWrapper}
                    justify={"center"}
                    align={"middle"}
                >
                    <Col className={clsx(s.inputWrapper, s.firstScore)}>
                        {!isDisabled ? (
                            <Input
                                className={clsx(
                                    s.input,
                                    s.firstScore,
                                    s.scoreText,
                                )}
                                type={"number"}
                                disabled={false}
                                placeholder={"—"}
                                min={0}
                                max={99}
                                value={homeScore}
                                onChange={(e) => setHomeScore(+e.target.value)}
                            />
                        ) : (
                            <p className={s.scoreText}>
                                {defaultHomeScore ?? "—"}
                            </p>
                        )}
                    </Col>
                    <Col>
                        <p
                            className={s.scoreText}
                            style={{ textAlign: "center" }}
                        >
                            :
                        </p>
                    </Col>
                    <Col className={s.inputWrapper}>
                        {!isDisabled ? (
                            <Input
                                className={clsx(s.input, s.scoreText)}
                                type={"number"}
                                disabled={isDisabled}
                                min={0}
                                max={99}
                                placeholder={"—"}
                                value={guestScore}
                                onChange={(e) => setGuestScore(+e.target.value)}
                            />
                        ) : (
                            <p className={s.scoreText}>
                                {defaultGuestScore ?? "—"}
                            </p>
                        )}
                    </Col>
                </Row>
            </Col>
            {isFillLinkAvailable && (
                <Col span={24}>
                    <Button type={"link"} href={href} block>
                        Заполнить
                    </Button>
                </Col>
            )}
        </Row>
    );
};