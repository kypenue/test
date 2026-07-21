"use client";

import { motion } from "framer-motion";
import { Button, Form, Input, Select, message, Typography } from "antd";
import {
    MailOutlined,
    PhoneOutlined,
    TeamOutlined,
    EnvironmentOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import { FaEnvelope, FaMailBulk, FaTelegram, FaTwitch } from "react-icons/fa";
import { useSendFeedbackMutation } from "@/services/Feedback/feedback";
import { getErrorMessage } from "@/shared/lib/getErrorMessage";
import { tournamentApi } from "@/services/Stages/stages";
import { FeedbackModel } from "@/services/Feedback/feedback.model";

const Contact = () => {
    const [, setIsMobile] = useState(false);
    const [form] = Form.useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIfMobile();
        window.addEventListener("resize", checkIfMobile);

        return () => window.removeEventListener("resize", checkIfMobile);
    }, []);

    const onFinish = (values: FeedbackModel) => {
        setIsSubmitting(true);
        if (!values?.tg_login) {
            values.tg_login = "";
        }
        fetch(
            process.env.NEXT_PUBLIC_APP_URL + "/api/v1/feedback/send-feedback",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json;charset=utf-8",
                },
                body: JSON.stringify(values),
            },
        )
            .then((res) => {
                if (!res.ok) {
                    return res
                        .json()
                        .then((res) =>
                            getErrorMessage(
                                { data: res },
                                message,
                                "Произошла ошибка",
                            ),
                        );
                } else {
                    message.success(
                        "Ваше сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.",
                    );
                    form.resetFields();
                }
            })
            .finally(() => setIsSubmitting(false));
    };

    return (
        <section id="contact" className="contact">
            {/* Background effects */}
            <div className="contact__bg-glow contact__bg-glow--purple" />
            <div className="contact__bg-glow contact__bg-glow--blue" />

            <div className="contact__container">
                <motion.div
                    className="contact__header"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="contact__header-title">
                        <span className="gradient-text">Связаться</span> с нашей
                        командой
                    </h2>
                    <p className="contact__header-subtitle">
                        Остались вопросы? Хотите обсудить индивидуальные условия
                        сотрудничества? Мы всегда на связи и готовы помочь!
                    </p>
                </motion.div>

                <div className="contact__content">
                    {/* Contact info */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="contact__info">
                            <h3 className="contact__info-title">
                                Наши контакты
                            </h3>
                            <p className="contact__info-subtitle">
                                Доступны для консультаций и помощи в организации
                                турниров
                            </p>
                        </div>

                        <div className="contact__links">
                            <div className="contact__link-item">
                                <div className="contact__icon-wrapper">
                                    <FaEnvelope className="contact__icon" />
                                </div>
                                <div className="contact__link-content">
                                    <h4 className="contact__link-content-title">
                                        Email
                                    </h4>
                                    <a
                                        href="mailto:info@cuply.pro"
                                        className="contact__link-content-link"
                                    >
                                        info@cuply.pro
                                    </a>
                                </div>
                            </div>

                            <div className="contact__link-item">
                                <div className="contact__icon-wrapper">
                                    <div className="contact__icon-container">
                                        <FaTelegram />
                                    </div>
                                </div>
                                <div className="contact__link-content">
                                    <h4 className="contact__link-content-title">
                                        Канал Cuply Team
                                    </h4>
                                    <a
                                        href="https://t.me/cuplypro"
                                        className="contact__link-content-link"
                                    >
                                        @cuplypro
                                    </a>
                                </div>
                            </div>
                            <div className="contact__link-item">
                                <div className="contact__icon-wrapper">
                                    <div className="contact__icon-container">
                                        <FaTelegram />
                                    </div>
                                </div>
                                <div className="contact__link-content">
                                    <h4 className="contact__link-content-title">
                                        Поддержка
                                    </h4>
                                    <a
                                        href="https://t.me/cuply_support_bot"
                                        className="contact__link-content-link contact__link-content-link--block"
                                    >
                                        @cuply_support_bot
                                    </a>
                                </div>
                            </div>
                            <div className="contact__link-item">
                                <div className="contact__icon-wrapper">
                                    <div className="contact__icon-container">
                                        <FaTwitch />
                                    </div>
                                </div>
                                <div className="contact__link-content">
                                    <h4 className="contact__link-content-title">
                                        Twitch
                                    </h4>
                                    <a
                                        href="https://www.twitch.tv/cuplypro"
                                        className="contact__link-content-link"
                                    >
                                        @cuplypro
                                    </a>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div id={"form"} className="contact__form">
                            <h3 className="contact__form-title">
                                Отправить сообщение
                                <br />
                                <Typography.Text
                                    style={{ color: "white", fontWeight: "40" }}
                                    type={"success"}
                                >
                                    Мы отвечаем в рабочее время в течение 4
                                    часов
                                </Typography.Text>
                            </h3>

                            <Form
                                form={form}
                                name="contact"
                                onFinish={onFinish}
                                layout="vertical"
                            >
                                <Form.Item
                                    name="name"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Пожалуйста, введите ваше имя",
                                        },
                                    ]}
                                    className="contact__form-input"
                                >
                                    <Input
                                        placeholder="Ваше имя *"
                                        size="large"
                                        className="form-control"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="email"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Пожалуйста, введите ваш email",
                                        },
                                        {
                                            type: "email",
                                            message:
                                                "Пожалуйста, введите корректный email",
                                        },
                                    ]}
                                    className="contact__form-input"
                                >
                                    <Input
                                        placeholder="Ваш email*"
                                        size="large"
                                        className="form-control"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="tg_login"
                                    className="contact__form-input"
                                >
                                    <Input
                                        placeholder="Ваш telegram"
                                        size="large"
                                        className="form-control"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="message"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Пожалуйста, введите ваше сообщение",
                                        },
                                    ]}
                                    className="contact__form-input"
                                >
                                    <Input.TextArea
                                        placeholder="Ваше сообщение *"
                                        rows={5}
                                        className="form-control"
                                    />
                                </Form.Item>

                                <Form.Item>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        size="large"
                                        className="btn-primary contact__form-button"
                                        loading={isSubmitting}
                                    >
                                        Отправить
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
