import { Col, Form, Row, Select, Typography } from "antd";

import { HTMLAttributes, ReactNode } from "react";

import { GameModel, PlatformModel } from "@/shared/types/models/Games";
import { selectEntityAdapter } from "@/shared/lib/selectEntityAdapter";

const { Text } = Typography;

interface EditableCellProps extends HTMLAttributes<HTMLElement> {
    isMobile: boolean;
    editable: boolean;
    dataIndex: string;
    children: ReactNode;
    platformsDictionary: Array<PlatformModel>;
    gamesDictionary: Array<GameModel>;
}

export const EditableCell = ({
    isMobile,
    editable,
    dataIndex,
    children,
    platformsDictionary,
    gamesDictionary,
}: EditableCellProps) => {
    if (dataIndex) {
        const options = dataIndex === "platform" ? selectEntityAdapter(platformsDictionary) : selectEntityAdapter(gamesDictionary);
        const placeholder = dataIndex === "platform" ? "Выберите платформу" : "Выберите игру";
        const label = dataIndex === "platform" ? "Платформа" : "Игра";

        if (isMobile) {
            return (
                <Row justify="space-between" style={{ padding: '10px 0' }}>
                    {editable ? (
                        <>
                            <Col>
                                <Text type="secondary" style={{ marginRight: 10 }}>{label}:</Text>
                            </Col>
                            <Col span={14}>
                                <Form.Item name={dataIndex} style={{ margin: 0 }}>
                                    <Select
                                        placeholder={placeholder}
                                        options={options}
                                    />
                                </Form.Item>
                            </Col>
                        </>

                    ) : (
                        <>
                            <Text type="secondary" style={{ marginRight: 10 }}>{label}:</Text>
                            {children}
                        </>

                    )}
                </Row>
            );
        }

        return (
            <td className="ant-table-cell" style={{ textAlign: "center" }}>
                {editable ? (
                    <Form.Item name={dataIndex} style={{ margin: 0 }}>
                        <Select
                            style={{ minWidth: 200 }}
                            placeholder={placeholder}
                            options={options}
                        />
                    </Form.Item>
                ) : (
                    children
                )}
            </td>
        );
    }

    return (
        <td className="ant-table-cell" style={{ textAlign: "center" }}>
            {children}
        </td>
    );
};