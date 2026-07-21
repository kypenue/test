import { Typography } from "antd";
import s from "./style.module.scss";
import Link from "next/link";

interface ProfileSectionTitleProps {
    link: string;
    title: string;
}

export const ProfileSectionTitle = ({
    link,
    title,
}: ProfileSectionTitleProps) => {
    return (
        <Link href={link} className={s.moreLink}>
            <Typography.Title level={4} className={s.title}>
                {title} ›
            </Typography.Title>
        </Link>
    );
};
