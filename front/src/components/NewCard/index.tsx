"use client";

import { Card, type CardProps } from "antd";
import { clsx } from "clsx";
import s from "./style.module.scss";

type NewCardProps = CardProps;

export const NewCard = ({ className, bordered, ...props }: NewCardProps) => {
    return (
        <Card
            bordered={bordered ?? false}
            className={clsx(s.card, className)}
            {...props}
        />
    );
};

