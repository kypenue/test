"use client";
import s from "./style.module.scss";
import { App, Button, Col, Layout, Row, Typography } from "antd";
import { useGetCommunitiesQuery } from "@/services/Communities/community";
import { SpaceCard } from "@/components/SpaceCard";
import { getStaticImage } from "@/shared/lib/getStaticImage";

const SpacesPage = () => {
    const { currentData } = useGetCommunitiesQuery({});
    const { modal } = App.useApp();

    const handleCreateSpaceClick = () => {
        modal.info({
            title: "Уведомление",
            content: (
                <p>
                    Пространства сейчас проходят стадию закрытого тестирования.
                    Вы можете написать нам в{" "}
                    <a
                        style={{ color: "lightblue" }}
                        href={`https://t.me/cuply_support_bot`}
                        target={"_blank"}
                    >
                        Telegram
                    </a>
                    , если хотите присоединиться к тестированию раньше
                </p>
            ),
        });
    };
    return (
        <Layout.Content className={s.body}>
            <Row
                style={{ width: "100%", paddingTop: "20vh" }}
                justify="center"
                gutter={[0, 16]}
            >
                <Col span={24}>
                    <Typography.Title className={s.title}>
                        Пространства
                    </Typography.Title>
                    <Typography.Text className={s.subTitle}>
                        Объединяйте участников турниров в сообщества, проводите
                        закрытые турниры и оставайтесь на связи со своей
                        аудиторией
                    </Typography.Text>
                </Col>
                <Col>
                    <Button
                        type={"primary"}
                        onClick={handleCreateSpaceClick}
                        size={"large"}
                    >
                        Создать пространство
                    </Button>
                </Col>
            </Row>
            <Row style={{ width: "100%", paddingTop: "5vh" }} gutter={[0, 16]}>
                <Col span={24}>
                    <Typography.Title level={4}>
                        Активные пространства
                    </Typography.Title>
                </Col>
                <Row gutter={[16, 16]}>
                    {currentData?.payload?.map((item) => (
                        <Col key={item.id}>
                            <SpaceCard
                                slug={item?.slug ?? item?.id}
                                title={item.title}
                                cover={getStaticImage("")}
                            />
                        </Col>
                    ))}
                </Row>
            </Row>
        </Layout.Content>
    );
};

export default SpacesPage;
