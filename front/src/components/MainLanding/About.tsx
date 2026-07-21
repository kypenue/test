"use client";

import { motion } from "framer-motion";
import { LikeOutlined, TeamOutlined, TrophyOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { Button } from "antd";
import { BiLogoTelegram } from "react-icons/bi";
import "@/components/OrganizersLanding/styles/about.scss";
import "@/components/OrganizersLanding/styles/common.scss";

type StatItemProps = {
    icon: React.ReactNode;
    value: string;
    label: string;
    delay?: number;
};

const StatItem = ({ icon, value, label, delay = 0 }: StatItemProps) => (
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

const About = () => {
    return (
        <section id="about" className="about">
            <div className="about__container">
                
                <div className="about__content">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <h3 className="about__text-title">О Cuply</h3>
                        <p className="about__text-description">
                            CUPLY создается руками людей с большим стажем работы в IT.
                            <br />
                            Мы всегда открыты к обратной связи, ваши идеи и предложения помогают нам создавать удобную платформу для киберспорта
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
                            <div className="about__image-content bracket" />
                        </div>
                    </motion.div>
                </div>

                <div className="about__stats">
                    <StatItem
                        icon={<TrophyOutlined />}
                        value="4"
                        label="Проведенных крупных турнира на 200+ человек и много неофициальных турниров до 16 человек "
                        delay={0.1}
                    />
                    <StatItem
                        icon={<TeamOutlined />}
                        value="800+"
                        label="Участников за все время проведения турниров"
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