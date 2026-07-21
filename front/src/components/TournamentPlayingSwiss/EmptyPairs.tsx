import { Col, Row, Typography } from "antd";

export const EmptyPairs = () => {
    return (
        <Row gutter={[0, 8]} align="middle">
            <Col span={24} style={{ textAlign: "center" }}>
                <Typography.Title
                    style={{
                        fontSize: 36,
                        fontWeight: 400,
                    }}
                >
                    Пока что не создано ни одной пары
                </Typography.Title>
            </Col>
            <Col span={24} style={{ textAlign: "center" }}>
                <Typography.Text>
                    Распределите игроков на пары, чтобы начать раунд
                </Typography.Text>
            </Col>
        </Row>
    );
};
