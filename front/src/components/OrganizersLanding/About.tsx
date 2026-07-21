"use client";

import { motion } from "framer-motion";
import { LikeOutlined, TeamOutlined, TrophyOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { FaTelegram } from "react-icons/fa";
import { Button } from "antd";
import { BsTelegram } from "react-icons/bs";
import { ImTelegram } from "react-icons/im";
import { BiLogoTelegram } from "react-icons/bi";

type StatItemProps = {
    icon: React.ReactNode;
    value: string;
    label: string;
    delay?: number;
};

const StatItem = ({ icon, value, label, delay = 0 }: StatItemProps) => {
    return (
        <motion.div
            className="stat-item"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
        >
            <div className="stat-item__icon">{icon}</div>
            <div className="stat-item__value">{value}</div>
            <div className="stat-item__label">{label}</div>
        </motion.div>
    );
};

const About = () => {
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
        <section id="about" className="about">
            <div className="about__container">
                <div className="about__content">
                    <motion.div
                        className="about__image"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="about__image-backdrop" />
                        <div className="about__image-container">
                            <div className="about__image-content bracket" />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <h3 className="about__text-title">О CUPLY</h3>
                        <p className="about__text-description">
                            Мы разрабатываем платформу для организаторов
                            турниров под их задачи и с фокусом на удобство: мы
                            поддерживаем разные форматы, настройки этапов и
                            визуализации результатов.
                        </p>
                        <ul className="about__features">
                            <li className="about__feature">
                                <span className="about__feature-icon">🎨</span>
                                <span>Удобная сетка и рейтинг участников</span>
                            </li>
                            <li className="about__feature">
                                <span className="about__feature-icon">💭</span>
                                <span>
                                    Возможность связаться с игроком через
                                    Telegram
                                </span>
                            </li>
                            <li className="about__feature">
                                <span className="about__feature-icon">⚙️</span>
                                <span>
                                    Управление жеребьевкой, адаптированная
                                    графика для стримов
                                </span>
                            </li>
                        </ul>
                    </motion.div>
                </div>
                <br />
                <br />
                <br />
                <br />
                <div className="about__content">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <h3 className="about__text-title">Cuply Team</h3>
                        <p className="about__text-description">
                            CUPLY создается руками людей с большим стажем работы
                            в IT.
                            <br />
                            Мы всегда открыты к обратной связи. Будем рады
                            развивать решение под ваши потребности
                        </p>
                        <p className="about__text-description">
                            <Button
                                type="default"
                                size="large"
                                style={{
                                    backgroundColor: "rgba(85, 32, 193, 0.1)",
                                    borderColor: "rgba(85, 32, 193, 0.2)",
                                    color: "#ffffff",
                                    padding: "0.75rem 1.5rem",
                                    height: "auto",
                                    fontWeight: 500,
                                    borderRadius: "0.375rem",
                                    transition: "all 0.3s",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "0.5rem",
                                }}
                                href="https://t.me/cuplypro"
                                icon={<BiLogoTelegram />}
                            >
                                Канал команды в Telegram
                            </Button>
                            <Button
                                type="default"
                                size="large"
                                style={{
                                    backgroundColor: "rgba(85, 32, 193, 0.1)",
                                    borderColor: "rgba(85, 32, 193, 0.2)",
                                    color: "#ffffff",
                                    padding: "0.75rem 1.5rem",
                                    height: "auto",
                                    fontWeight: 500,
                                    borderRadius: "0.375rem",
                                    transition: "all 0.3s",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "0.5rem",
                                    marginTop: "1rem",
                                }}
                                href="https://t.me/cuply_support_bot"
                                icon={"👋"}
                            >
                                Связаться с нами
                            </Button>
                        </p>
                    </motion.div>
                    <motion.div
                        className="about__image"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="about__image-backdrop" />
                        <div className="about__image-container">
                            <div className="about__image-content" />
                        </div>
                    </motion.div>
                </div>

                <div className="about__stats">
                    <StatItem
                        icon={<TrophyOutlined />}
                        value="3"
                        label="Проведенных крупных турнира на 200+ человек"
                        delay={0.1}
                    />
                    <StatItem
                        icon={<TeamOutlined />}
                        value="500+"
                        label="Участников"
                        delay={0.2}
                    />
                    <StatItem
                        icon={<LikeOutlined />}
                        value="3000+"
                        label="Ежемесячных посетителей"
                        delay={0.3}
                    />
                </div>
            </div>
        </section>
    );
};

export default About;
