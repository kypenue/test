import { App, Button, Col, Flex, Input, Rate, Row } from "antd";
import { useState } from "react";
import { useSetOpponentMarkMutation } from "@/services/Series/series";
import { useParams } from "next/navigation";
import { getErrorMessage } from "@/shared/lib/getErrorMessage";

const options = ["Ужасный", "Плохой", "Нормальный", "Хороший", "Отличный"];

export const RateCompetitor = () => {
    const { message } = App.useApp();
    const [value, setValue] = useState(0);
    const [comment, setComment] = useState("");
    const { tournamentId, seriesId } = useParams<{
        tournamentId: string;
        seriesId: string;
    }>();

    const [setMark, { isLoading }] = useSetOpponentMarkMutation();
    const onSubmit = () => {
        setMark({ tournamentId, seriesId, opponent_mark: value, comment }).then(
            (res) => {
                if ("data" in res) {
                    message.success("Вы успешно зарегистрировались на турнир");
                }
                if ("error" in res && res.error) {
                    getErrorMessage(res.error, message);
                }
            },
        );
    };
    return (
        <Row gutter={[16, 16]} justify={"center"}>
            <Col xs={24}>
                <Flex justify={"center"}>
                    <Rate
                        tooltips={options}
                        onChange={setValue}
                        value={value}
                    />
                </Flex>
            </Col>{" "}
            <Col xs={24} style={{ maxWidth: 300 }}>
                <Input.TextArea
                    value={comment}
                    rows={3}
                    placeholder={"Ваш комментарий"}
                    onChange={(e) => setComment(e.target.value)}
                />
            </Col>
            <Col xs={24}>
                <Flex gap={8} justify={"center"}>
                    <Button
                        loading={isLoading}
                        style={{ maxWidth: 300 }}
                        type={"primary"}
                        block
                        onClick={onSubmit}
                    >
                        Сохранить
                    </Button>
                </Flex>
            </Col>
        </Row>
    );
};