"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Tabs, TabsProps } from "antd";
import { useState, useEffect, useCallback, useMemo, ReactNode } from "react";
import { CheckOutlined, FilterOutlined } from "@ant-design/icons";
import Swiss from "../../../public/icons/swiss-icon.svg";
import DE from "../../../public/icons/de-icon.svg";
import SE from "../../../public/icons/se-icon.svg";
import Group from "../../../public/icons/group-icon.svg";

// Define types for the stage objects
type StageContent = {
    title: string;
    description: string;
    image: string | ReactNode;
    options: string[];
    comingSoon?: boolean;
};

type Stage = {
    key: string;
    label: string;
    content: StageContent;
};

// Define stages with their content
const stages: Stage[] = [
    {
        key: "single",
        label: "Single Elimination",
        content: {
            title: "Single Elimination",
            description:
                "Классический олимпийский формат, где проигравший выбывает. Идеально подходит для небольших турниров с ограниченным временем проведения. Простая структура делает формат понятным для всех участников.",
            image: "/organizersLanding/se-icon.svg",
            options: [
                "Количество игр в основной сетке",
                "Количество игр в суперфинале",
                "Фора в суперфинале",
            ],
        },
    },
    {
        key: "double",
        label: "Double Elimination",
        content: {
            title: "Double Elimination",
            description:
                "Формат с двумя шансами – проигравший переходит в сетку лузеров. Более справедливый формат, дающий возможность восстановиться после одного поражения. Подходит для турниров среднего размера.",
            image: "/organizersLanding/de-icon.svg",
            options: [
                "Количество игр в основной сетке",
                "Количество игр в суперфинале",
                "Фора в суперфинале",
            ],
        },
    },
    {
        key: "swiss",
        label: "Swiss",
        content: {
            title: "Швейцарская система",
            description:
                "Швейцарская система позволяет всем участникам сыграть одинаковое количество игр. Участники играют против соперников с похожими результатами. Идеально для турниров с большим количеством участников.",
            image: "/organizersLanding/swiss-icon.svg",
            options: [
                "Количество побед и поражений для перехода",
                "Количество игр в суперфинале",
            ],
        },
    },
    {
        key: "wildcard",
        label: "Wildcard",
        content: {
            title: "Wildcard",
            description:
                "Специальный формат, позволяющий определенным участникам прямой доступ в следующий этап турнира. Создает дополнительный интерес и возможности для сильных игроков или специальных гостей.",
            image: <FilterOutlined />,
            options: ["Количество игр в сетке"],
        },
    },
    {
        key: "groups",
        label: "Группы",
        content: {
            title: "Групповой этап",
            description:
                "Участники разбиваются на группы, где каждый играет с каждым. Лучшие из групп проходят в плей-офф. Формат обеспечивает баланс между количеством игр и справедливостью отбора.",
            image: "/organizersLanding/group-icon.svg",
            comingSoon: true,
            options: [],
        },
    },
];

// StageContent component to render the content of each tab
const renderStageContent = (stage: Stage, isMobile: boolean) => {
    const { content } = stage;

    return (
        <motion.div
            key={stage.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                alignItems: "center",
                gap: "3rem",
                padding: "1rem 0",
            }}
        >
            <div
                style={{
                    flex: 1,
                    order: isMobile ? 2 : 1,
                    maxWidth: isMobile ? "100%" : "50%",
                }}
            >
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                >
                    <h3
                        style={{
                            fontSize: "2rem",
                            fontWeight: "bold",
                            marginBottom: "1.5rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.75rem",
                        }}
                    >
                        {content.title}
                        {content.comingSoon && (
                            <span
                                style={{
                                    fontSize: "0.875rem",
                                    backgroundColor: "rgba(0, 242, 255, 0.15)",
                                    color: "var(--accent)",
                                    padding: "0.25rem 0.5rem",
                                    borderRadius: "0.375rem",
                                    fontWeight: "normal",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    height: "1.5rem",
                                }}
                            >
                                Скоро
                            </span>
                        )}
                    </h3>
                    <p
                        style={{
                            fontSize: "1.125rem",
                            color: "var(--text-secondary)",
                            lineHeight: 1.7,
                            marginBottom: "2rem",
                        }}
                    >
                        {content.description}
                    </p>
                    {!!content.options.length && (
                        <>
                            {" "}
                            Управляйте настройками 👇
                            <div
                                style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: "1rem",
                                    marginTop: "1.5rem",
                                }}
                            >
                                {content.options.map((item, index) => (
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "0.5rem",
                                            backgroundColor:
                                                "rgba(85, 32, 193, 0.1)",
                                            padding: "0.5rem 1rem",
                                            borderRadius: "2rem",
                                            color: "var(--text-primary)",
                                        }}
                                        key={index}
                                    >
                                        <span
                                            style={{ color: "var(--accent)" }}
                                        >
                                            <CheckOutlined />
                                        </span>
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </motion.div>
            </div>

            <div
                style={{
                    flex: 1,
                    order: isMobile ? 1 : 2,
                    position: "relative",
                    maxWidth: isMobile ? "100%" : "45%",
                }}
            >
                <motion.div
                    style={{
                        backgroundColor: "var(--card-bg)",
                        borderRadius: "0.75rem",
                        padding: "1.5rem",
                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                        position: "relative",
                        overflow: "hidden",
                        height: isMobile ? "240px" : "320px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            backgroundImage:
                                "linear-gradient(135deg, rgba(85, 32, 193, 0.1), rgba(0, 242, 255, 0.05))",
                            zIndex: 0,
                        }}
                    />

                    {/* SVG illustrations for each stage type */}
                    <div
                        style={{
                            position: "relative",
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            zIndex: 1,
                        }}
                    >
                        {stage.key === "single" &&
                            (typeof stage.content.image === "string" ? (
                                <SE
                                    alt="Single Elimination"
                                    width={200}
                                    height={200}
                                    
                                    style={{
                                        opacity: content.comingSoon ? 0.5 : 1,
                                    }}
                                />
                            ) : (
                                stage.content.image
                            ))}
                        {stage.key === "double" && (
                            <DE
                                src={stage.content.image}
                                alt="Double Elimination"
                                width={200}
                                height={200}
                                style={{
                                    opacity: content.comingSoon ? 0.5 : 1,
                                }}
                            />
                        )}
                        {stage.key === "swiss" && (
                            <Swiss
                                src={stage.content.image}
                                alt="Swiss"
                                width={200}
                                height={200}
                                style={{
                                    opacity: content.comingSoon ? 0.5 : 1,
                                }}
                            />
                        )}
                        {stage.key === "wildcard" && (
                            <FilterOutlined
                                src="/organizersLanding/wildcard.svg"
                                alt="Wildcard"
                                size={200}
                                style={{
                                    fontSize: 100,
                                    opacity: content.comingSoon ? 0.5 : 1,
                                }}
                            />
                        )}
                        {stage.key === "groups" && (
                            <Group
                                src={stage.content.image}
                                alt="Groups"
                                width={200}
                                height={200}
                                style={{
                                    opacity: content.comingSoon ? 0.5 : 1,
                                }}
                            />
                        )}
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

const TournamentStages = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [activeTab, setActiveTab] = useState("single");

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIfMobile();
        window.addEventListener("resize", checkIfMobile);

        return () => window.removeEventListener("resize", checkIfMobile);
    }, []);

    const handleTabChange = useCallback((key: string) => {
        setActiveTab(key);
    }, []);

    const stagesTabs: TabsProps["items"] = useMemo(() => {
        return stages.map((stage) => ({
            key: stage.key,
            label: stage.label,
            children: renderStageContent(stage, isMobile),
        }));
    }, [isMobile]);

    return (
        <section
            id="stages"
            style={{
                backgroundColor: "var(--background)",
                paddingTop: "6rem",
                paddingBottom: "6rem",
            }}
        >
            <div
                style={{
                    maxWidth: "80rem",
                    margin: "0 auto",
                    padding: "0 1rem",
                }}
            >
                <motion.div
                    style={{ textAlign: "center", marginBottom: "4rem" }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <h2
                        style={{
                            fontSize: isMobile ? "2rem" : "2.5rem",
                            fontWeight: "bold",
                            marginBottom: "1.5rem",
                        }}
                    >
                        Этапы <span className="gradient-text">турниров</span>
                    </h2>
                    <p
                        style={{
                            fontSize: "1.25rem",
                            color: "var(--text-secondary)",
                            maxWidth: "48rem",
                            margin: "0 auto",
                        }}
                    >
                        CUPLY поддерживает различные форматы турниров для
                        создания идеальных соревнований
                    </p>
                </motion.div>

                <Tabs
                    defaultActiveKey="single"
                    activeKey={activeTab}
                    centered
                    className="custom-tabs"
                    items={stagesTabs}
                    style={{ color: "var(--text-primary)" }}
                    tabBarStyle={{
                        marginBottom: "2rem",
                        borderBottom: "1px solid #222",
                    }}
                    onChange={handleTabChange}
                />
            </div>
        </section>
    );
};

export default TournamentStages;
