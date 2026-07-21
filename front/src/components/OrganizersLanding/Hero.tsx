"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button, Typography } from "antd";
import Link from "next/link";
import Image from "next/image";

const Hero = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIfMobile();
        window.addEventListener("resize", checkIfMobile);

        return () => window.removeEventListener("resize", checkIfMobile);
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
            },
        },
    };

    return (
        <section id="hero" className="hero">
            <div className="container">
                <div className="hero__content">
                    <motion.div
                        className="hero__content-wrapper"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div
                            variants={itemVariants}
                            className={`hero__content-text ${isMobile ? "hero__content-text--mobile" : "hero__content-text--desktop"}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h1 className="hero__title">
                                Современные турниры c{" "}
                                <span className="gradient-text">CUPLY</span>
                            </h1>
                            <p className="hero__subtitle">
                                Проводите турниры с легкостью: доверьтесь нашим
                                алгоритмам распределения игроков, визуализации
                                сетки и подтверждения результатов
                            </p>
                            <div className="hero__buttons">
                                <Button
                                    type="primary"
                                    size="large"
                                    className="gradient-button"
                                    href="/auth"
                                >
                                    <div>Создать турнир</div>
                                    <Typography.Text
                                        className={"sub-text"}
                                        type={"secondary"}
                                    >
                                        это бесплатно, но нужна регистрация{" "}
                                    </Typography.Text>
                                </Button>
                            </div>
                        </motion.div>
                        {isMobile ? (
                            <motion.div
                                variants={itemVariants}
                                className="hero__image hero__image--mobile"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                <Image 
                                    src="/organizersLanding/cup.png" 
                                    alt="CUPLY Cup" 
                                    width={170} 
                                    height={170}
                                    className="hero__image-mobile-cup"
                                />
                            </motion.div>
                        ) : (
                            <motion.div
                                variants={itemVariants}
                                className="hero__image"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                <div className="hero__image-backdrop">
                                    <div className="hero__image-circles"></div>
                                    <div className="hero__image-container">
                                        <div className="hero__image-wrapper">
                                            <div className="relative flex justify-center items-center p-4 w-full h-full hero__image-overlay">
                                                <div className="hero__image-content background-image" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
