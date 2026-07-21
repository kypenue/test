import { Button, Col, Row, Segmented } from "antd";
import type { BRACKETS_TYPE } from "@/shared/constants/bracketsTypes";
import {
    ApartmentOutlined,
    AppstoreOutlined,
    OrderedListOutlined,
} from "@ant-design/icons";
import { useGetCurrentUserQuery } from "@/services/User/user";
import { useParams } from "next/navigation";
import { useGetTournamentByIdPersonalInfoQuery } from "@/services/Tournament/tournament";

interface NavigationProps {
    currentBracketType: BRACKETS_TYPE;
    handleTabChange: (tab: string) => void;
    activeTab: string;
    isEliminationStage: boolean;
    registration_status: number;
}

const TABS = [
    {
        label: "Раунды",
        value: "rounds",
        icon: <AppstoreOutlined />,
    },
    {
        label: "Рейтинг",
        value: "rating",
        icon: <OrderedListOutlined />,
    },
];

const DE_TABS = [
    {
        label: "Раунды",
        value: "rounds",
        icon: <AppstoreOutlined />,
    },
    {
        label: "Турнирная сетка",
        value: "backet",
        icon: <ApartmentOutlined />,
    },
];

export const Navigation = ({
    currentBracketType,
    handleTabChange,
    activeTab,
    isEliminationStage,
    registration_status,
}: NavigationProps) => {
    const { tournamentId } = useParams<{ tournamentId: string }>();

    const { currentData: user } = useGetCurrentUserQuery();
    const { currentData: account } = useGetTournamentByIdPersonalInfoQuery({
        id: tournamentId,
    });

    return (
        <Row justify={"space-between"} align={"middle"}>
            <Col>
                {currentBracketType === "SWISS" && (
                    <div style={{ margin: "16px 0" }}>
                        <Segmented
                            onChange={handleTabChange}
                            value={activeTab}
                            options={TABS}
                        />
                    </div>
                )}
                {isEliminationStage && (
                    <div style={{ margin: "16px 0" }}>
                        <Segmented
                            onChange={handleTabChange}
                            value={activeTab}
                            options={DE_TABS}
                        />
                    </div>
                )}
            </Col>
            {registration_status === 3 && account && !isEliminationStage && (
                <Col>
                    <Button
                        type={"text"}
                        href={`#user-${user?.id}#:~:text=${account.participant.account.login}`}
                    >
                        Показать меня
                    </Button>
                </Col>
            )}
        </Row>
    );
};
