import { Anchor, BottomText } from "@/components/Match/styles";
import React, { memo } from "react";
import { useRouter } from "next/navigation";
import s from "./Match.module.scss";

interface BottomSideProps {
    nextWinnerName: string;
    nextLoserName: string;
}

export const BottomSide = memo(
    ({ nextWinnerName, nextLoserName }: BottomSideProps) => {
        const router = useRouter();
        const handleAnchorClick = (elementId: string) => {
            const element = document.getElementById(elementId);

            if (element) {
                element.scrollIntoView({
                    block: "center",
                });
                router.push(`#${elementId}`, { scroll: false });
            }
        };

        return (
            <div className={s.bottomSeriesWrapper}>
                <Anchor onClick={() => handleAnchorClick(nextLoserName)}>
                    <BottomText className={s.bottomSeriesLoserName}>
                        {nextLoserName ?? " "}
                    </BottomText>
                </Anchor>
                <Anchor onClick={() => handleAnchorClick(nextWinnerName)}>
                    <BottomText className={s.bottomSeriesWinnerName}>
                        {nextWinnerName ?? " "}
                    </BottomText>
                </Anchor>
            </div>
        );
    },
);
