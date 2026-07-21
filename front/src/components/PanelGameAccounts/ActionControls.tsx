import { Button, Col, Row } from "antd";

interface ActionControlsProps {
    isEditing: boolean;
    onAdd: () => void;
    onSave: () => void;
    onCancel: () => void;
}

export const ActionControls = ({
    isEditing,
    onAdd,
    onSave,
    onCancel,
}: ActionControlsProps) => {
    return (
        <Row>
            <Col span={24} offset={0}>
                {!isEditing && (
                    <Button
                        type="primary"
                        size="large"
                        block
                        style={{ marginTop: 36, padding: 18 }}
                        onClick={onAdd}
                    >
                        Добавить игровые аккаунты
                    </Button>
                )}
                {isEditing && (
                    <Row gutter={[16, 16]} style={{ marginTop: 18 }}>
                        <Col sm={12} xs={24}>
                            <Button
                                type="default"
                                size="large"
                                block
                                style={{
                                    display: "inline-flex",
                                }}
                                onClick={onCancel}
                            >
                                Не сохранять
                            </Button>
                        </Col>
                        <Col sm={12} xs={24}>
                            <Button
                                type="primary"
                                size="large"
                                block
                                style={{
                                    display: "inline-flex",
                                }}
                                onClick={onSave}
                            >
                                Сохранить изменения
                            </Button>
                        </Col>
                    </Row>
                )}
            </Col>
        </Row>
    );
};
