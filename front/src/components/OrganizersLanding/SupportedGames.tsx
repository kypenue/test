"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, Typography } from "antd";
import Link from "next/link";
import Image from "next/image";

const SupportedGames = () => {
  const games = [
    {
      id: "eafc24",
      name: "EA FC 24",
      logo: "/organizersLanding/eafc24.png",
    },
    {
      id: "eafc25",
      name: "EA FC 25",
      logo: "/organizersLanding/eafc25.png",
    },
  ];

  return (
    <section id="supported-games" className="supported-games section">
      <div className="container">
        <motion.div
          className="mb-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="section__title">
            Поддерживаемые <span className="gradient-text">игры</span>
          </h2>
          <p className="section__subtitle">
            Сейчас мы поддерживаем небольшой набор игр для организаторов. Не нашли нужную игру? 
            <Link href="#contact" className="supported-games__link"> Напишите нам</Link> - мы оперативно обсудим детали!
          </p>
        </motion.div>

        <div className="supported-games__cards">
          {games.map((game, index) => (
            <motion.div
              key={game.id}
              className="supported-games__card-wrapper"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.15 }}
            >
              <Card className="supported-games__card">
                <div className="supported-games__card-inner">
                  <div className="supported-games__card-image-container">
                    <Image
                      src={game.logo}
                      alt={game.name}
                      fill
                      className="supported-games__card-image"
                    />
                  </div>
                  <Typography.Title level={4} className="supported-games__card-title">
                    {game.name}
                  </Typography.Title>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SupportedGames; 