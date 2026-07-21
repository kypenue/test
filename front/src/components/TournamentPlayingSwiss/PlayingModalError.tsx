import { Button, Col, Modal, Row, Typography } from "antd";

const { Text, Title } = Typography;

export interface PlayingModalErrorProps {
    isModalOpen: boolean;
    onCloseModal: () => void;
}

export const PlayingModalError = ({ isModalOpen, onCloseModal }: PlayingModalErrorProps) => {

    return (
        <Modal
            open={isModalOpen}
            centered={true}
            closable={false}
            footer={
                <Button type="primary" onClick={onCloseModal}>
                    Назад
                </Button>
            }
        >
            <Row gutter={[8, 8]} justify={"center"} align={"middle"}>
                <Col span={24} style={{ position: "relative" }}>
                    <Title level={4}>Ошибка</Title>
                </Col>
                <Col span={24} style={{ position: "relative" }}>
                    <Text>Произошла ошибка при создании пары. Вернитесь назад и попробуйте снова</Text>
                </Col>
            </Row>
        </Modal>
    );
};
