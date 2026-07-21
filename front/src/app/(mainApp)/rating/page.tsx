"use client";
import { Flex, Layout } from "antd";
import { RatingTable } from "@/components/RatingTable";
import { RatingGameSelector } from "@/components/RatingGameSelector";
import { useState } from "react";

import s from "./rating.module.scss";

const RatingPage = () => {
    const [gameId, setGameId] = useState<number | null>(null);

    return (
        <Layout.Content className={s.body}>
            <Flex vertical gap={"16px"}>
                <RatingGameSelector setGameId={setGameId} gameId={gameId} />
                {gameId && <RatingTable gameId={gameId} />}
            </Flex>
        </Layout.Content>
    );
};

export default RatingPage;
