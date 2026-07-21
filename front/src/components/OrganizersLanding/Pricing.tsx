"use client";

import { motion } from "framer-motion";
import { Button, Badge, Table } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";

type PlanFeature = {
    text: string;
    included: boolean;
};

type PricingPlan = {
    name: string;
    price: string;
    description: string;
    features: PlanFeature[];
    ctaText: string;
    popular?: boolean;
    link: string;
};

const PlanCard = ({ plan }: { plan: PricingPlan }) => {
    return (
        <motion.div
            className={`pricing-card ${plan.popular ? "pricing-card-popular" : ""}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
        >
            <h3 className="mb-2 pricing-card-title">{plan.name}</h3>

            <p className="text-secondary mb-4" style={{ minHeight: 48 }}>
                {plan.description}
            </p>

            <div className="pricing-card-price mb-4">{plan.price}</div>

            <ul style={{ minHeight: 288 }} className="pricing-card-features">
                {plan.features.map((feature, index) => (
                    <li key={index} className="feature">
                        <span className="icon">
                            {feature.included ? (
                                <CheckOutlined />
                            ) : (
                                <CloseOutlined className="pricing-disabled-text" />
                            )}
                        </span>
                        <span
                            className={
                                feature.included
                                    ? "text-white"
                                    : "pricing-disabled-text"
                            }
                        >
                            {feature.text}
                        </span>
                    </li>
                ))}
            </ul>

            <Button
                type={plan.popular ? "primary" : "default"}
                size="large"
                className={`${plan.popular ? "btn-primary" : "btn-outline"} pricing-cta`}
                href={plan.link}
            >
                {plan.ctaText}
            </Button>
        </motion.div>
    );
};

const Pricing = () => {
    const [, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIfMobile();
        window.addEventListener("resize", checkIfMobile);

        return () => window.removeEventListener("resize", checkIfMobile);
    }, []);

    const plans: PricingPlan[] = [
        {
            name: "Бесплатный",
            price: "0 ₽",
            description: "Подходит для небольших турниров",
            features: [
                { text: "До 16 участников", included: true },
                {
                    text: "Два формата: Single и Double Elimination",
                    included: true,
                },
                { text: "До 3 активных турниров", included: true },
                { text: "Автоматическая генерация сетки", included: true },
                { text: "Мульти-этапные турниры", included: false },
                { text: "Кастомизация дизайна", included: false },
            ],
            ctaText: "Создать турнир",
            link: "/auth",
        },
        {
            name: "Персональный",
            price: "β-тест",
            description: "Подходит для небольших турниров",
            features: [
                {
                    text: "Неограниченное количество участников",
                    included: true,
                },
                {
                    text: "Все форматы турниров",
                    included: true,
                },
                { text: "До 3 активных турниров", included: true },
                { text: "Автоматическая генерация сетки", included: true },
                { text: "Мульти-этапные турниры", included: true },

                { text: "Кастомизация дизайна", included: false },
            ],
            ctaText: "Запросить beta-тест",
            link: "#form",
        },
        {
            name: "Организатор",
            price: "по запросу",
            description:
                "Для регулярных турниров и взаимодействия с аудиторией",
            features: [
                {
                    text: "Неограниченное количество участников",
                    included: true,
                },
                { text: "Все форматы турниров", included: true },
                {
                    text: "До 5 активных турниров",
                    included: true,
                },
                { text: "Автоматическая генерация сетки", included: true },
                { text: "Мульти-этапные турниры", included: true },
                { text: "Кастомизация дизайна", included: true },
                {
                    text: "Выделенное пространство организатора",
                    included: true,
                },
            ],
            ctaText: "Связаться с командой",
            popular: true,
            link: "#form",
        },
    ];

    // Comparison table data
    const columns = [
        {
            title: "Функция",
            dataIndex: "feature",
            key: "feature",
            render: (text: string) => (
                <span className="text-white heading-semibold">{text}</span>
            ),
        },
        {
            title: "Бесплатный",
            dataIndex: "free",
            key: "free",
            align: "center" as "center",
            render: (value: boolean | string) => {
                if (typeof value === "boolean") {
                    return value ? (
                        <CheckOutlined className="text-accent pricing-icon-size" />
                    ) : (
                        <CloseOutlined className="pricing-disabled-text pricing-icon-size" />
                    );
                }
                return <span className="text-white">{value}</span>;
            },
        },
        {
            title: "Персональный",
            dataIndex: "personal",
            key: "personal",
            align: "center" as "center",
            render: (value: boolean | string) => {
                if (typeof value === "boolean") {
                    return value ? (
                        <CheckOutlined className="text-accent pricing-icon-size" />
                    ) : (
                        <CloseOutlined className="pricing-disabled-text pricing-icon-size" />
                    );
                }
                return <span className="text-white">{value}</span>;
            },
        },
        {
            title: "Организатор",
            dataIndex: "org",
            key: "org",
            align: "center" as "center",
            render: (value: boolean | string) => {
                if (typeof value === "boolean") {
                    return value ? (
                        <CheckOutlined className="text-accent pricing-icon-size" />
                    ) : (
                        <CloseOutlined className="pricing-disabled-text pricing-icon-size" />
                    );
                }
                return <span className="text-white">{value}</span>;
            },
        },
    ];

    const data = [
        {
            key: "1",
            feature: "Количество участников",
            free: "До 16",
            personal: "Неограниченно",
            org: "Неограниченно",
        },
        {
            key: "2",
            feature: "Форматы турниров",
            free: "SE, DE",
            personal: "Все доступные на данный момент",
            org: "Все доступные на данный момент",
        },
        {
            key: "3",
            feature: "Активные турниры",
            free: "До 1",
            personal: "До 3",
            org: "До 5",
        },
        {
            key: "4",
            feature: "Автоматическая генерация сетки",
            free: true,
            personal: true,
            org: true,
        },
        {
            key: "6",
            feature: "Мульти-этапные турниры",
            free: false,
            personal: true,
            org: true,
        },
        {
            key: "7",
            feature: "Выделенное пространство",
            free: false,
            personal: false,
            org: true,
        },
        {
            key: "7",
            feature: "Кастомизация пространства",
            free: false,
            personal: false,
            org: true,
        },
        {
            key: "9",
            feature: "Техническая поддержка",
            free: "Базовая",
            personal: "Базовая",
            org: "Приоритетная",
        },
    ];

    return (
        <section id="pricing" className="section">
            <div className="container">
                <motion.div
                    className="text-center mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="section__title">
                        Простые и понятные{" "}
                        <span className="gradient-text">тарифы</span>
                    </h2>
                    <p className="section__subtitle">
                        Выберите тариф, который лучше всего подходит для ваших
                        турниров
                    </p>
                </motion.div>

                <div className={`grid grid-cols-1 grid-cols-md-3 mb-6`}>
                    {plans.map((plan, index) => (
                        <PlanCard key={index} plan={plan} />
                    ))}
                </div>

                <motion.div
                    className="mb-6"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <Table
                        columns={columns}
                        dataSource={data}
                        pagination={false}
                        className="pricing-table"
                    />
                </motion.div>

                <motion.div
                    className="text-center p-4 bg-card rounded-lg mt-6 pricing-container"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <h3 className="mb-3 heading-small">
                        Нужны особые условия?
                    </h3>
                    <p className="text-secondary mb-3">
                        Если у вас особые требования или большой турнир,
                        свяжитесь с нами для обсуждения индивидуальных условий
                    </p>
                    <Button
                        type="primary"
                        size="large"
                        className="btn-primary"
                        href="#form"
                    >
                        Связаться с нами
                    </Button>
                </motion.div>
            </div>
        </section>
    );
};

export default Pricing;
