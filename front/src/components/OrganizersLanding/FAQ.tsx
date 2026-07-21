"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Collapse } from "antd";

type FAQItem = {
    question: string;
    answer: string | React.ReactNode;
};

const FAQ = () => {
    const [, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIfMobile();
        window.addEventListener("resize", checkIfMobile);

        return () => window.removeEventListener("resize", checkIfMobile);
    }, []);

    const faqItems: FAQItem[] = [
        {
            question: "Как создать свой первый турнир?",
            answer: (
                <>
                    Каждый зарегистрированный пользователь может бесплатно
                    создать один турнир с максимум 16 участниками. После
                    завершения турнира вы сможете создать новый. <br />
                    <br /> Если вам нужен турнир без ограничений по количеству
                    игроков, присоединяйтесь к нашему бета-тестированию! Просто
                    заполните <a href={"#form"}>форму на сайте</a>, и мы
                    свяжемся с вами.
                </>
            ),
        },
        {
            question: "Как получить больше возможностей для подписки?",
            answer: (
                <>
                    Хотите создавать турниры без ограничений по количеству
                    участников? Участвуйте в нашем бета-тестировании! Для этого
                    нужно заполнить <a href={"#form"}>форму на сайте</a>.
                </>
            ),
        },
        {
            question: "Можно ли настроить брендинг своего пространства?",
            answer: "Мы работаем над функцией брендинга для подписки уровня «Организатор». Скоро вы сможете добавлять описание, логотип и фоны для своего пространства.",
        },
        {
            question: "Будут ли добавляться новые игры на CUPLY?",
            answer: "Да, список игр регулярно обновляется! Если нужной игры пока нет, напишите нам через Телеграм-бот поддержки, и мы постараемся добавить её.",
        },
        {
            question: "Как работает поддержка?",
            answer: "Наша поддержка отвечает в рабочее время. Обычно это занимает до 4 часов.",
        },
        {
            question: "Как предложить улучшение сервиса?",
            answer: "У вас есть идея? Напишите нам через Телеграм-бот поддержки! Мы всегда рады предложениям и стремимся сделать платформу лучше.",
        },
    ];

    return (
        <section id="faq" className="section">
            <div className="container">
                <motion.div
                    className="text-center mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="section__title">
                        Частые <span className="gradient-text">вопросы</span>
                    </h2>
                    <p className="section__subtitle">
                        Ответы на самые распространенные вопросы о платформе
                        CUPLY
                    </p>
                </motion.div>

                <motion.div
                    className="mx-auto pricing-container"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <Collapse
                        bordered={false}
                        expandIconPosition="end"
                        className="custom-collapse"
                        items={faqItems.map((item, index) => ({
                            key: index,
                            label: item.question,
                            children: (
                                <div className="accordion__content">
                                    {item.answer}
                                </div>
                            ),
                            className: "accordion__item",
                            headerClass: "accordion__header",
                            collapsible: "header",
                        }))}
                    />
                </motion.div>
            </div>
        </section>
    );
};

export default FAQ;
