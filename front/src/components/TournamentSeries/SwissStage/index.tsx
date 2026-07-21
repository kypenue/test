import { Col, Flex, Row, Select } from "antd";
import { SwissRating } from "@/components/SwissRating";
import { SwissGroups } from "@/components/SwissGroups";
import { useParams } from "next/navigation";
import { useGetStageByIdQuery } from "@/services/Stages/stages";

interface SwissStageProps {
    activeTab: string;
    currentStageId: string;
    currentRound: string;
    setCurrentRound: (newRound: string) => void;
    rounds:
        | {
              label: string;
              value: string;
              disabled: boolean;
          }[]
        | undefined;
}

export const SwissStage = ({
    activeTab,
    currentStageId,
    currentRound,
    setCurrentRound,
    rounds,
}: SwissStageProps) => {
    const { tournamentId } = useParams<{ tournamentId: string }>();

    const { currentData: currentStage } = useGetStageByIdQuery(
        {
            tournamentId: +tournamentId,
            stageId: currentStageId,
        },
        { skip: !currentStageId, refetchOnMountOrArgChange: true },
    );

    return (
        <>
            {activeTab === "rating" && (
                <Row style={{ width: "100%" }} justify={"center"}>
                    <Col xs={24}>
                        <SwissRating
                            tournamentId={tournamentId}
                            stageId={currentStageId}
                            swissStageId={currentStage?.swiss_stage?.id ?? ""}
                        />
                    </Col>
                </Row>
            )}
            {activeTab === "rounds" && (
                <>
                    <Col xs={24}>
                        {currentStage?.swiss_stage?.rounds && (
                            <Flex justify={"space-between"}>
                                <div>
                                    <Select
                                        style={{
                                            minWidth: "200px",
                                        }}
                                        value={currentRound}
                                        onChange={setCurrentRound}
                                        options={rounds}
                                    />
                                </div>
                                <div>
                                    {/*<Checkbox*/}
                                    {/*    checked={*/}
                                    {/*        isNonFinishedShown*/}
                                    {/*    }*/}
                                    {/*    onChange={*/}
                                    {/*        setIsNonFinishedShown*/}
                                    {/*    }*/}
                                    {/*>*/}
                                    {/*    Только*/}
                                    {/*    незавершенные*/}
                                    {/*</Checkbox>*/}
                                </div>
                            </Flex>
                        )}
                    </Col>
                    <Col xs={24}>
                        {currentStage && (
                            <SwissGroups
                                tournamentId={tournamentId}
                                stageId={currentStageId}
                                swissStageId={
                                    currentStage.swiss_stage?.id ?? ""
                                }
                                roundId={currentRound}
                                status={"PLAYING"}
                                stageType={"swiss"}
                            />
                        )}
                    </Col>
                </>
            )}
        </>
    );
};
