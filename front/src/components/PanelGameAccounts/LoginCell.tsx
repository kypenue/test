// @ts-nocheck
import { Button, Col, Flex, Form, Input, Row, Tooltip, Typography } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

import { GamersTableColumns } from "@/shared/types/models/Games";

interface LoginCellProps<T> {
    isMobile: boolean;
    editable: boolean;
    dataIndex: string;
    record: T;
    onEdit: (record: T) => void;
    onDelete: ((record: T) => void) | null;
}

export const LoginCell = <T extends GamersTableColumns>({
    isMobile,
    editable,
    dataIndex,
    record,
    onEdit,
    onDelete,
}: LoginCellProps<T>) => {
    const onEditItem = () => onEdit(record);

    const onDeleteItem = () => onDelete(record);

    const checkLogin = (_: any, value: string) => {
        const reg = /^(?=.*[@])/;
        if (!reg.test(value)) {
            return Promise.resolve();
        }
        if (!value?.trim()?.length) {
            return Promise.reject(new Error("Введите никнейм"));
        }
        return Promise.reject(new Error("Недопустимый символ @"));
    };

    if (isMobile) {
        return (
            <Row justify="space-between" style={{ padding: "10px 0" }}>
                {editable ? (
                    <>
                        <Col>
                            <Typography.Text
                                type="secondary"
                                style={{ marginRight: 10 }}
                            >
                                EA ID:
                            </Typography.Text>
                        </Col>
                        <Col span={14}>
                            <Tooltip
                                trigger={["focus"]}
                                title="Никнейм, по которому вас смогут найти другие игроки"
                                placement="topLeft"
                            >
                                <Form.Item
                                    rules={[{ validator: checkLogin }]}
                                    name={dataIndex}
                                    style={{
                                        margin: 0,
                                        display: "inline-flex",
                                    }}
                                >
                                    <Input
                                        prefix={<EditOutlined />}
                                        style={{ width: "100%" }}
                                        maxLength={50}
                                        autoComplete={"off"}
                                    />
                                </Form.Item>
                            </Tooltip>
                        </Col>
                        <Col span={24}>
                            <Button
                                block
                                style={{ paddingLeft: 0, marginTop: 20 }}
                                type="primary"
                                onClick={onDeleteItem}
                                icon={<DeleteOutlined />}
                            >
                                Удалить
                            </Button>
                        </Col>
                    </>
                ) : (
                    <>
                        <Col>
                            <Typography.Text
                                type="secondary"
                                style={{ marginRight: 10 }}
                            >
                                EA ID:
                            </Typography.Text>
                        </Col>
                        <Col>
                            <Typography.Text>{record.login}</Typography.Text>
                        </Col>
                        <Col span={24}>
                            <Button
                                block
                                style={{ paddingLeft: 0, marginTop: 20 }}
                                type="primary"
                                onClick={onEditItem}
                                icon={<EditOutlined />}
                            >
                                Редактировать
                            </Button>
                        </Col>
                    </>
                )}
            </Row>
        );
    }

    return (
        <>
            {editable ? (
                <Row wrap={false}>
                    <Col>
                        <Tooltip
                            trigger={["focus"]}
                            title="Никнейм, по которому вас смогут найти другие игроки"
                            placement="topLeft"
                        >
                            <Form.Item
                                rules={[{ validator: checkLogin }]}
                                name={dataIndex}
                                style={{ margin: 0, display: "inline-flex" }}
                            >
                                <Input
                                    prefix={<EditOutlined />}
                                    maxLength={25}
                                    pattern="[^@]*"
                                    title="Символ @ не используется в никах"
                                    placeholder="Игровой аккаунт"
                                    autoComplete={"off"}
                                />
                            </Form.Item>
                        </Tooltip>
                    </Col>
                    <Col>
                        <Button
                            style={{ paddingLeft: 0 }}
                            type="link"
                            onClick={onDeleteItem}
                            icon={<DeleteOutlined />}
                        />
                    </Col>
                </Row>
            ) : (
                <Flex justify={"center"} style={{ width: "100%" }}>
                    {record.login}
                    <Button type="link" onClick={onEditItem}>
                        <EditOutlined />
                    </Button>
                </Flex>
            )}
        </>
    );
};
