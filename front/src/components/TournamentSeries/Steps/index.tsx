import { Col, Row } from "antd";
import { TournamentStagesStepper } from "@/components/TournamentStagesStepper";
import type { TournamentStage } from "@/shared/types/models/Stages";
import type { BRACKETS_TYPE } from "@/shared/constants/bracketsTypes";

interface StepsProps {
    stages: Array<TournamentStage>;
    current: number;
    onChange: ({
        current,
        bracketType,
    }: {
        current: number;
        bracketType: BRACKETS_TYPE;
    }) => void;
}

export const Steps = ({ onChange, current, stages }: StepsProps) => {
    return (
        <Row gutter={[32, 16]}>
            <Col span={24}>
                <TournamentStagesStepper
                    type="navigation"
                    size="small"
                    onChange={onChange}
                    current={current}
                    stages={stages}
                />
            </Col>
        </Row>
    );
};
