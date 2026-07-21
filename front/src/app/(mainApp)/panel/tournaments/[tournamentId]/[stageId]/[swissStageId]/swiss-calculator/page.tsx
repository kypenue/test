"use client";
import {
    App,
    Button,
    Card,
    Col,
    Form,
    Input,
    Row,
    Table,
    Typography,
} from "antd";
import {
    useCountSwissTableMutation,
    useSaveSwissSettingsMutation,
} from "@/services/Tournament/tournament";
import { tournamentApi } from "@/services/Stages/stages";
import { useParams } from "next/navigation";
import { SwissCalculatorArgs } from "@/shared/types/models/Tournament";
import { useMemo } from "react";
import { swissColumns } from "./columns";
import s from "./style.module.scss";
import _ from "lodash";
import { getErrorMessage } from "@/shared/lib/getErrorMessage";
import { useDispatch } from "react-redux";

interface Calculator {
    losses_count: string;
    players_count: string;
    wins_count: string;
}

const SwissCalculatorPage = () => {
    const dispatch = useDispatch();
    const { tournamentId, stageId, swissStageId } = useParams<{
        tournamentId: string;
        stageId: string;
        swissStageId: string;
    }>();

    const { message } = App.useApp();

    const [calculateSwiss, { data, isLoading }] = useCountSwissTableMutation();
    const [saveSwissSettings] = useSaveSwissSettingsMutation();

    const dataSource = useMemo(() => {
        if (!data) {
            return [];
        }
        return Object.keys(data.percentage).map((key) => ({
            key,
            index: key,
            percentage: data.percentage[key],
            players: data.players[key],
            wins: data.wins[key],
            losses: data.losses[key],
            cum_sum: data.cum_sum[key],
        }));
    }, [data]);

    const [form] = Form.useForm<Calculator>();

    const gamesCount =
        Number(form.getFieldValue("losses_count")) +
        Number(form.getFieldValue("wins_count")) -
        1;

    const onCalculate = (values: Calculator) => {
        const body = Object.fromEntries(
            Object.entries(values).map(([key, value]) => [key, +value]),
        ) as Omit<SwissCalculatorArgs, "tournamentId">;
        calculateSwiss({ tournamentId: tournamentId, ...body });
    };

    const onSave = () => {
        const { wins_count, losses_count } = form.getFieldsValue();
        const body = {
            tournamentId,
            stageId,
            swissStageId,
            wins_needed: +wins_count,
            loses_needed: +losses_count,
        };
        saveSwissSettings(body).then((res) => {
            if ("error" in res && res.error) {
                getErrorMessage(res.error, message);
            } else {
                message.success("Настройки сохранены");
                dispatch(
                    tournamentApi.util.invalidateTags(["STAGES", "STAGE"]),
                );
            }
        });
    };

    return (
        <div>
            <Row justify={"center"} gutter={[32, 32]}>
                <Col xs={24} sm={12}>
                    <Card style={{ backgroundColor: "#22195A" }} type="inner">
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onCalculate}
                        >
                            <Form.Item
                                name="players_count"
                                label="Количество участников"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Введите количество участников!",
                                    },
                                ]}
                            >
                                <Input type="number" />
                            </Form.Item>
                            <Form.Item
                                name="wins_count"
                                label="Количество побед"
                                rules={[
                                    {
                                        required: true,
                                        message: "Введите количество побед!",
                                    },
                                ]}
                            >
                                <Input type="number" />
                            </Form.Item>
                            <Form.Item
                                name="losses_count"
                                label="Количество поражений"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Введите количество поражений!",
                                    },
                                ]}
                            >
                                <Input type="number" />
                            </Form.Item>
                            <Form.Item>
                                <Button
                                    block
                                    type="default"
                                    size={"large"}
                                    htmlType="submit"
                                >
                                    Рассчитать
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
                <Col xs={24} sm={12}>
                    <Table
                        pagination={false} // Hide pagination
                        scroll={{
                            y: 270,
                        }}
                        loading={isLoading}
                        dataSource={dataSource}
                        columns={swissColumns}
                        rowClassName={s.customRow}
                        className={s.table}
                    />
                    {data && _.isNumber(gamesCount) && (
                        <Typography.Paragraph
                            style={{ marginTop: 8, fontSize: 16 }}
                        >
                            Общее количество раундов: <b>{gamesCount}</b>
                        </Typography.Paragraph>
                    )}
                </Col>
                <Col>
                    <Button onClick={onSave} type={"primary"} size={"large"}>
                        Сохранить параметры в турнире
                    </Button>
                </Col>
            </Row>
        </div>
    );
};

export default SwissCalculatorPage;
