import { Flex, Typography } from "antd";

interface CardProps {
    title: string;
    value: string | number;
}

import s from "./TournamentStats.module.scss";

export const Card = ({ title, value }: CardProps) => (
    <Flex vertical className={s.card} align={"center"} justify={"center"}>
        <Typography.Title level={5} className={s.title}>
            {title}
        </Typography.Title>
        <Typography.Text className={s.text}>{value.toString()}</Typography.Text>
    </Flex>
);
