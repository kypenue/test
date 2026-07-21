import { Skeleton, Typography } from "antd";
import {
    DoubleEliminationBracket,
    MatchType,
    SingleEliminationBracket,
    SVGViewer,
} from "@g-loot/react-tournament-brackets/dist/esm";
import Match from "@/components/Match";
import GlootTheme from "@/components/Match/theme";
import { useGetBracketQuery } from "@/services/Tournament/tournament";
import { useParams, useRouter } from "next/navigation";
import { memo, useEffect, useMemo } from "react";
import _ from "lodash";
import { useWindowSize } from "usehooks-ts";
import { isMobile } from "react-device-detect";
import { DOUBLE_ELIMINATION_OPTIONS } from "@/components/TournamentBrackets/utils";
import { useElementSize } from "@custom-react-hooks/use-element-size";
import { MatchesModel } from "@/shared/types/models/Tournament";

export interface TournamentBracketsProps {
    tournamentId: string;
    stageId: string;
    deStageId?: string;
    seStageId?: string;
}

export const TournamentBrackets = memo(
    ({
        tournamentId,
        stageId,
        deStageId,
        seStageId,
    }: TournamentBracketsProps) => {
        //const { tournamentId } = useParams<{ tournamentId: string }>();
        const { data, isLoading } = useGetBracketQuery({
            tournamentId,
            stageId,
            deStageId,
            seStageId,
        });
        const router = useRouter();
        const [setRef, { width: widthElement }] = useElementSize();
        const { width, height } = useWindowSize();
        const finalWidth = Math.max(widthElement, 500);
        const finalHeight = isMobile ? height : 50000;

        useEffect(() => {
            if (window.location.hash && !isLoading) {
                const element = document.getElementById(
                    decodeURI(window.location.hash.substring(1)),
                );
                if (element) {
                    element.scrollIntoView({
                        block: "center",
                    });
                }
            }
        }, [isLoading]);

        const isEmpty =
            !data ||
            (deStageId &&
                typeof data === "object" &&
                !Array.isArray(data) &&
                (!data?.upper?.length || !data?.lower?.length)) ||
            (seStageId && !Array.isArray(data));

        const memoizedData = useMemo(() => {
            if (data) {
                return _.cloneDeep(data) as MatchesModel & MatchType[];
            }
        }, [data]);

        const handleMatchClick = ({ match }: { match: MatchType }) => {
            if (match?.series_id && match?.participants.length) {
                router.push(
                    `/tournaments/${tournamentId}/series/${match?.series_id}`,
                );
            }
        };

        const BracketComponent = deStageId
            ? DoubleEliminationBracket
            : SingleEliminationBracket;

        return (
            <div>
                {isLoading && <Skeleton active />}
                {isEmpty && !isLoading ? (
                    <div style={{ textAlign: "center", margin: "40px" }}>
                        <Typography.Paragraph>
                            Данные по турнирной сетке сейчас недоступны
                        </Typography.Paragraph>
                    </div>
                ) : (
                    memoizedData && (
                        <div
                            ref={setRef}
                            id="bracket"
                            style={{ overflowX: "auto" }}
                        >
                            <BracketComponent
                                matches={memoizedData}
                                matchComponent={Match}
                                theme={GlootTheme}
                                options={DOUBLE_ELIMINATION_OPTIONS}
                                onMatchClick={handleMatchClick}
                                svgWrapper={({ children, ...props }) => (
                                    <SVGViewer
                                        background={"#1C173A"}
                                        SVGBackground={"#1C173A"}
                                        width={isMobile ? width : finalWidth}
                                        height={finalHeight}
                                        scaleFactorMin={-100}
                                        detectWheel={!!isMobile}
                                        detectPinchGesture={true}
                                        miniatureProps={{ position: "none" }}
                                        {...props}
                                    >
                                        {children}
                                    </SVGViewer>
                                )}
                            />
                        </div>
                    )
                )}
            </div>
        );
    },
);

TournamentBrackets.displayName = "TournamentBrackets";
