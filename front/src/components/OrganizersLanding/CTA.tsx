"use client";

import { motion } from "framer-motion";
import { Button, Row, Col } from "antd";
import { RocketOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";

const CTA = () => {
    const [, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIfMobile();
        window.addEventListener("resize", checkIfMobile);

        return () => window.removeEventListener("resize", checkIfMobile);
    }, []);

    return (
        <section id="create" className="cta">
            <div className="cta__background" />
            <div className="cta__glow cta__glow--purple" />
            <div className="cta__glow cta__glow--blue" />

            <div className="cta__container">
                <motion.div
                    className="cta__card"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                >
                    <motion.h2
                        className="cta__title"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        Готовы начать с{" "}
                        <span className="gradient-text">CUPLY?</span>
                    </motion.h2>

                    <motion.p
                        className="cta__description"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        Выберите подходящий вариант для вашего турнира и
                        получите доступ к современным инструментам для
                        проведения киберспортивных соревнований
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <Row
                            gutter={[16, 16]}
                            justify={"center"}
                            className="cta__grid"
                        >
                            <Col xs={24} md={8}>
                                <div className="option-card option-card--purple">
                                    <div className="option-card__header">
                                        <h3 className="option-card__title">
                                            Создать турнир
                                        </h3>
                                    </div>
                                    <p className="option-card__description">
                                        Начните с бесплатного турнира и оцените
                                        возможности платформы
                                    </p>
                                    <Button
                                        type="primary"
                                        size="large"
                                        className="option-card__button--primary"
                                        href="https://cuply.pro/auth"
                                    >
                                        Регистрация
                                    </Button>
                                </div>
                            </Col>

                            <Col xs={24} md={8}>
                                <div className="option-card option-card--blue">
                                    <div className="option-card__header">
                                        <h3 className="option-card__title">
                                            Консультация
                                        </h3>
                                    </div>
                                    <p className="option-card__description">
                                        Примите участие в beta тесте платных
                                        турниров
                                    </p>
                                    <Button
                                        type="default"
                                        size="large"
                                        className="option-card__button--outline"
                                        href="#form"
                                    >
                                        Связаться
                                    </Button>
                                </div>
                            </Col>

                            <Col xs={24} md={8}>
                                <div className="option-card option-card--neutral">
                                    <div className="option-card__header">
                                        <h3 className="option-card__title">
                                            Telegram
                                        </h3>
                                    </div>
                                    <p className="option-card__description">
                                        Напишите нам напрямую в телеграм
                                        <br />
                                        <br />
                                    </p>
                                    <Button
                                        type="default"
                                        size="large"
                                        className="option-card__button--neutral"
                                        href="https://t.me/cuply_support_bot"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Перейти в Telegram
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default CTA;
