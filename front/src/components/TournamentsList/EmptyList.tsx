import { Button, Col, Row, Typography } from "antd";

interface EmptyListProps {
    isActive: boolean;
}

const { Title, Text } = Typography;

export const EmptyList = ({ isActive }: EmptyListProps) => {

    return (
        <Row gutter={[16, 16]}>
            <Col span={16} offset={4}>
                <Row gutter={[16, 24]} justify="center">
                    <Col style={{ textAlign: 'center' }} span={24}>
                        <Title>{isActive ? 'Пока вы не создали ни одного турнира' : 'Пока нет завершенных турниров'}</Title>
                        <Text>Создавайте, настраивайте и играйте!</Text>
                    </Col>
                    <Col span={24}>
                        <Button
                            type="primary"
                            href="/tournaments/create"
                            block
                            size="large"
                        >
                            Создать турнир
                        </Button>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
};