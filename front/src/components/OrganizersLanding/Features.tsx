"use client";

import { motion } from "framer-motion";
import {
    TeamOutlined,
    TrophyOutlined,
    RocketOutlined,
    BarChartOutlined,
    SettingOutlined,
    MessageOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    delay?: number;
}

const FeatureCard = ({
    icon,
    title,
    description,
    delay = 0,
}: FeatureCardProps) => {
    return (
        <motion.div
            className="section__card"
            whileHover={{
                transform: "translateY(-5px)",
                boxShadow: "0 10px 30px -10px rgba(85, 32, 193, 0.3)",
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
        >
            <div className="section__icon">{icon}</div>
            <h3 className="section__card-title">{title}</h3>
            <p className="section__card-content">{description}</p>
        </motion.div>
    );
};

const Features = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 640);
            setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024);
        };

        checkScreenSize();
        window.addEventListener("resize", checkScreenSize);

        return () => window.removeEventListener("resize", checkScreenSize);
    }, []);

    const getGridColumns = () => {
        if (isMobile) return "grid-cols-1";
        if (isTablet) return "grid-cols-sm-2";
        return "grid-cols-lg-3";
    };

    const features = [
        {
            icon: <TeamOutlined />,
            title: "Привлечение новой аудитории",
            description:
                "Создавайте захватывающие турниры в выделенных пространствах организатора, которые привлекут аудиторию CUPLY к вам",
        },
        {
            icon: <TrophyOutlined />,
            title: "Гибкие форматы",
            description:
                "Single Elimination, Double Elimination, Swiss и WildCard. Комбинируйте форматы для создания уникальных соревнований",
        },
        {
            icon: <RocketOutlined />,
            title: "Берем рутину на себя",
            description:
                "Полуавтоматическая жеребьевка и генерация сеток. Забудьте о рутинной работе и сосредоточьтесь на взаимодействии с аудиторией",
        },
        {
            icon: <BarChartOutlined />,
            title: "Рейтинг игроков",
            description:
                "Отслеживайте статистику участников, используйте данные для улучшения ваших будущих турниров",
        },
        {
            icon: <SettingOutlined />,
            title: "Полный контроль",
            description:
                "Гибкие правила, форматы, сетка, возраст и другие настройки турнира",
        },
        {
            icon: <MessageOutlined />,
            title: "Интеграция с Telegram",
            description: "Мгновенная коммуникация со всеми участниками турнира",
        },
    ];

    return (
        <section id="features" className="section">
            <div className="container">
                <motion.div
                    className="mb-6 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="section__title">
                        <span className="gradient-text">Возможности</span> для
                        организаторов
                    </h2>
                    <p className="section__subtitle">
                        CUPLY предоставляет все необходимые инструменты для
                        организации и проведения киберспортивных турниров любого
                        масштаба
                    </p>
                </motion.div>

                <div className={`grid ${getGridColumns()}`}>
                    {features.map((feature, index) => (
                        <FeatureCard
                            key={index}
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                            delay={index * 0.1}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
