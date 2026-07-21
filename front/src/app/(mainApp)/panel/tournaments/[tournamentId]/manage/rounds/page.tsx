"use client";

import {
    App,
    Button,
    Card,
    Col,
    Divider,
    Row,
    Skeleton,
    Typography,
} from "antd";
import {
    useGetTournamentByIdQuery,
    useSetNewRoundMutation,
} from "@/services/Tournament/tournament";

const RoundsPage = ({ params }: { params: { tournamentId: string } }) => {
    const { message } = App.useApp();

    const { currentData: tournament, isLoading } = useGetTournamentByIdQuery({
        id: params.tournamentId,
    });
    const [updateRound] = useSetNewRoundMutation();

    const onSetNewRound = () => {
        updateRound({ id: params.tournamentId }).then((res) => {
            if ("data" in res) {
                message.success("Следующий раунд успешно стартовал");
            }
            if ("error" in res && res.error) {
                message.error("Ошибка при старте нового раунда");
            }
        });
    };

    return (
        <>
            {isLoading && <Skeleton active />}
            {tournament && (
                <Row>
                    <Col span={24} style={{ textAlign: "center" }}>
                        <Typography.Title level={4}>
                            {tournament.name}
                        </Typography.Title>
                    </Col>
                    <Col span={24}>
                        <Card type={"inner"} title={"Управление раундами"}>
                            <Button
                                onClick={onSetNewRound}
                                type={"primary"}
                                block={true}
                            >
                                Начать следующий раунд
                            </Button>
                            {/* {ROUNDS.map((item) => (
                                <div>
                                    <Row
                                        align={"middle"}
                                        justify={"space-between"}
                                        key={item.id}
                                    >
                                        <Col>Раунд #{item?.id}</Col>
                                        <Col>
                                            <Button>Начать</Button>
                                        </Col>
                                    </Row>
                                    <Divider />
                                </div>
                            ))} */}
                        </Card>
                    </Col>
                </Row>
            )}
        </>
    );
};

export default RoundsPage;
