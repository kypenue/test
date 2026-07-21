"use client";

import { App, Button, Card, Col, Row } from "antd";
import { ContentCard } from "@/components/ContentCard";
import { pairsMock, participantsMock } from "@/shared/constants/tossMock";

import "./style.css";
import { useRef } from "react";

const TossPage = () => {
    const { modal } = App.useApp();

    const ref = useRef<HTMLDivElement>(null);
    const handleToss = () => {
        const getRandomId = () => {
            const first =
                participantsMock[
                Math.floor(Math.random() * participantsMock.length)
                ];
            const second =
                participantsMock[
                Math.floor(Math.random() * participantsMock.length)
                ];
            return [first, second];
        };

        const deleteListItem = (id: string) => {
            if (!ref.current) return;
            const listItem = document.getElementById(id)!;
            const scrollPos =
                listItem.offsetTop -
                ref.current?.getBoundingClientRect()?.height / 2 -
                listItem.getBoundingClientRect().height / 2;

            ref.current?.scrollTo({ top: scrollPos, behavior: "smooth" });

            setTimeout(() => {
                listItem.classList.add("is-deleting");
                setTimeout(() => {
                    listItem?.parentNode?.removeChild(listItem);
                }, 500);
            }, 1000);
        };

        deleteListItem(getRandomId()[0].id?.toString());
        setTimeout(() => {
            deleteListItem(getRandomId()[0].id?.toString());
            setTimeout(() => {
                modal.success({
                    className: "custom-modal",
                    centered: true,
                    mask: true,
                    maskClosable: true,
                    closable: true,
                });
            }, 2000);
        }, 2000);
    };
    return (
        <div>
            <Row style={{ margin: 0 }} gutter={[16, 16]}>
                <Col span={16}>
                    <ContentCard title="Соперники">
                        <div
                            style={{
                                maxHeight: "calc(100vh - 200px)",
                                overflowY: "scroll",
                                scrollbarWidth: "none",
                            }}
                        >
                            {pairsMock.map((pair, index) => (
                                <Card key={index}>
                                    <Row
                                        gutter={[16, 16]}
                                        justify={"space-between"}
                                    >
                                        <Col>{pair[0].account.login}</Col>
                                        <Col>:</Col>
                                        <Col>{pair[1].account.login}</Col>
                                    </Row>
                                </Card>
                            ))}
                        </div>
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <Button
                                    onClick={handleToss}
                                    block
                                    type={"primary"}
                                >
                                    Назначить соперника
                                </Button>
                            </Col>
                            <Col span={12}>
                                <Button block> Сбросить соперников</Button>
                            </Col>
                        </Row>
                    </ContentCard>
                </Col>
                <Col span={8}>
                    <ContentCard title="Участники">
                        <div
                            ref={ref}
                            style={{
                                maxHeight: "40vh",
                                overflowY: "scroll",
                                scrollbarWidth: "none",
                                display: "grid",
                            }}
                        >
                            {participantsMock.map((pair, index) => (
                                <Card
                                    id={pair.id?.toString()}
                                    className={"item"}
                                    style={{ marginBottom: 8 }}
                                    key={index}
                                >
                                    <Row
                                        gutter={[16, 16]}
                                        justify={"space-between"}
                                    >
                                        <Col>{pair.account.login}</Col>
                                    </Row>
                                </Card>
                            ))}
                        </div>
                    </ContentCard>
                </Col>
            </Row>
        </div>
    );
};

export default TossPage;
