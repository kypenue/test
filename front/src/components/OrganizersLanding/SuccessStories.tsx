"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Typography, Button, Card } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import Link from "next/link";

// Custom hook for responsive design
const useResponsive = () => {
  const [screenSize, setScreenSize] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setScreenSize({
        isMobile: width < 640,
        isTablet: width >= 640 && width < 1024,
        isDesktop: width >= 1024,
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return screenSize;
};

const SuccessStories = () => {
  const { isMobile } = useResponsive();

  return (
    <section id="success-stories" className="success-stories section">
      <div className="container">
        <motion.div
          className="mb-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="section__title">
            Посмотрите на <span className="gradient-text">CUPLY</span> в действии
          </h2>
          <p className="section__subtitle">
            Реальный пример турнира на нашей платформе
          </p>
        </motion.div>

        <div className="success-stories__content">
          <motion.div
            className="success-stories__video-wrapper"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="success-stories__video-container">
              <iframe
                src="https://www.youtube.com/embed/WOZ-Fs3BObE?start=1741"
                title="Весенний Кубок Ветеранов 2025"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="success-stories__video"
              ></iframe>
            </div>
          </motion.div>

          <motion.div
            className="success-stories__tournament-card-wrapper"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="success-stories__accent-light"></div>
            <Card className="success-stories__tournament-card">
              <div className="success-stories__tournament-card-content">
                <div className="success-stories__tournament-info">
                  <Typography.Title level={4} className="success-stories__tournament-title">
                    Весенний Кубок Ветеранов 2025
                  </Typography.Title>
                  <Typography.Paragraph className="success-stories__tournament-description">
                    Один из крупнейших любительских турниров с более чем 200 участниками из разных стран. Турнир проводится на платформе CUPLY с полной автоматизацией распределения игроков и подтверждения результатов.
                  </Typography.Paragraph>
                  <Link href="https://cuply.pro/tournaments/18" target="_blank" className="success-stories__tournament-link">
                    <Button 
                      type="primary" 
                      size={isMobile ? "middle" : "large"} 
                      className="success-stories__tournament-button"
                      icon={<ArrowRightOutlined />}
                    >
                        Перейти к турниру на CUPLY
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SuccessStories; 