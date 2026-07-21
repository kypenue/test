import { Alert, Button, Col, Form, Input, QRCode, Row, Tooltip } from "antd";
import { useEffect, useRef, useState } from "react";
import {
    useGetCurrentUserQuery,
    useVerifyTelegramMutation,
} from "@/services/User/user";

export const ConnectTelegram = () => {
    const [form] = Form.useForm();
    const [nicknameError, setNicknameError] = useState<boolean>(false);
    const refInterval = useRef<number | undefined>();
    const { currentData, refetch } = useGetCurrentUserQuery();
    const [verify, { isLoading, data }] = useVerifyTelegramMutation();

    const nickname = Form.useWatch("nickname", form);

    const verifyTelegram = () => {
        verify({ tg_login: nickname });
    };

    useEffect(() => {
        form.validateFields({ validateOnly: true })
            .then(() => setNicknameError(true))
            .catch(() => setNicknameError(false));
    }, [form, nickname]);

    useEffect(() => {
        if (currentData?.tg_login) {
            window.clearInterval(refInterval.current);
            form.setFieldValue("nickname", currentData?.tg_login);
        }
    }, [currentData?.tg_login]);

    useEffect(() => {
        if (data?.full_link) {
            //@ts-ignore
            refInterval.current = setInterval(refetch, 2000);
        }

        return () => {
            window.clearInterval(refInterval.current);
        };
    }, [data?.full_link]);

    const checkNickname = (_: any, value: string) => {
        const reg = /^[@][a-zA-Z0-9-_@]{4,50}$/;
        if (reg.test(value)) {
            return Promise.resolve();
        }
        return Promise.reject(new Error("Неверно указан никнейм"));
    };

    const infoText =
        "Никнейм может содержать только латинские буквы, цифры и символ '_' и начинается с @";

    return (
        <Form form={form} component={false}>
            <Row>
                <Col>
                    <Form.Item
                        validateTrigger="onBlur"
                        rules={[{ validator: checkNickname }]}
                        layout={"vertical"}
                        label={"Ваш никнейм в Telegram"}
                        name="nickname"
                    >
                        <Row gutter={[8, 16]} align={"middle"}>
                            <Col>
                                <Tooltip
                                    trigger={["focus"]}
                                    title={infoText}
                                    placement="topLeft"
                                >
                                    <Input
                                        placeholder={
                                            currentData?.tg_login
                                                ? `@${currentData?.tg_login}`
                                                : "@nickname"
                                        }
                                        disabled={
                                            !!data || !!currentData?.tg_login
                                        }
                                    />
                                </Tooltip>
                            </Col>
                            <Col>
                                {currentData?.tg_login ? (
                                    "✅ Верифицирован"
                                ) : (
                                    <Button
                                        loading={isLoading}
                                        disabled={
                                            !!data ||
                                            !!currentData?.tg_login ||
                                            !nickname ||
                                            !nicknameError
                                        }
                                        onClick={verifyTelegram}
                                    >
                                        Верифицировать
                                    </Button>
                                )}
                            </Col>
                        </Row>
                    </Form.Item>
                    {data && !currentData?.tg_login && (
                        <Alert
                            description={
                                <Row justify={"center"}>
                                    <Col span={24}>
                                        Для завершения верификации откройте
                                        нашего Telegram-бота по{" "}
                                        <a
                                            target={"_blank"}
                                            href={data.full_link}
                                        >
                                            ссылке
                                        </a>{" "}
                                        или отсканируйте QR-код
                                    </Col>
                                    <Col>
                                        <div
                                            style={{
                                                padding: "16px",
                                            }}
                                        >
                                            <QRCode
                                                color={"#0E0029"}
                                                bgColor={"white"}
                                                value={data.full_link}
                                                level={"H"}
                                            />
                                        </div>
                                    </Col>
                                </Row>
                            }
                            message={"Остался один шаг"}
                        />
                    )}
                </Col>
            </Row>
        </Form>
    );
};
