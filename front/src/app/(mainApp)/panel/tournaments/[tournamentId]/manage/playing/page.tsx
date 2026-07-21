"use client";

import { App, Button, Card, Col, Row, Skeleton } from "antd";
import {
    useGetTournamentByIdQuery,
    useSetBracketMutation,
} from "@/services/Tournament/tournament";

const PlayingPage = ({ params }: { params: { tournamentId: string } }) => {
    const { message } = App.useApp();

    const { currentData: tournament, isLoading } = useGetTournamentByIdQuery({
        id: params.tournamentId,
    });

    const [create] = useSetBracketMutation();

    const onSetBracket = () => {
        create({ id: params.tournamentId }).then((res) => {
            if ("data" in res) {
                message.success("Турнирная сетка создана");
            }
            if ("error" in res && res.error) {
                message.error("Ошибка при создании сетки");
            }
        });
    };

    return (
        <>
            {isLoading && <Skeleton active />}
            {tournament && (
                <Row>
                    <Col span={24}>
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <Card
                                    type={"inner"}
                                    title={"Жеребьевка команд"}
                                >
                                    <Button
                                        href={`/tournaments/${params?.tournamentId}/playing`}
                                        type={"primary"}
                                        block={true}
                                    >
                                        Перейти к жеребьевке
                                    </Button>
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card type={"inner"} title={"Турнирная сетка"}>
                                    <Button
                                        onClick={onSetBracket}
                                        type={"primary"}
                                        block={true}
                                    >
                                        Создать турнирную сетку
                                    </Button>
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card type={"inner"} title={"Жеребьевка пар"}>
                                    <Button
                                        href={`/tournaments/${params?.tournamentId}/enemy`}
                                        type={"primary"}
                                        block={true}
                                    >
                                        Перейти к жеребьевке
                                    </Button>
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            )}
        </>
    );
};

export default PlayingPage;
