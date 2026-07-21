import s from "./style.module.scss";
import Link from "next/link";

export interface SpaceCardProps {
    title: string;
    cover: string;
    slug: string;
}

export const SpaceCard = ({ title, cover, slug }: SpaceCardProps) => {
    return (
        <Link href={`/s/${slug}`}>
            <article className={s.card}>
                <img className={s["card__background"]} src={cover} />
                <div className={s["card__content"]}>
                    <h2 className={s["card__title"]}>{title}</h2>
                </div>
            </article>
        </Link>
    );
};
