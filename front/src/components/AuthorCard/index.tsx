import { Card } from "antd";
import s from "./style.module.scss";

export interface AuthorCardProps {
    title: string;
    description: string;
}

export const AuthorCard = ({ title, description }: AuthorCardProps) => {
    return (
        <Card className={s.card}>
            <Card.Meta title={title} description={description} />
        </Card>
    );
};
