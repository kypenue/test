// CardSelector.tsx
import React, { type CSSProperties } from "react";
import { Card } from "antd";
import styles from "./style.module.scss";
import { getStaticImage } from "@/shared/lib/getStaticImage";
import { FileModel } from "@/services/Files/file.model";
import { clsx } from "clsx";

interface Option {
    id: number | string;
    name: string;
    icon?: (style?: CSSProperties) => React.ReactElement;
    image?: FileModel | null;
    description?: string;
    disabled?: boolean;
}

interface CardSelectorProps {
    options: Option[];
    value: string | number | null | undefined;
    onChange: (id: number | string) => void;
    iconStyle?: CSSProperties;
}

export const CardSelector = React.forwardRef(
    ({ options, value, onChange, iconStyle }: CardSelectorProps, ref) => {
        return (
            <div className={styles.cardContainer}>
                {options?.map((option) => (
                    <Card
                        //@ts-ignore
                        ref={ref}
                        key={option.id}
                        className={clsx(styles.card, {
                            [styles.selectedCard]: value === option.id,
                            [styles.disabled]: option?.disabled,
                        })}
                        onClick={() => onChange(option.id)}
                        style={{
                            background: `url("${getStaticImage(
                                option?.image?.object_key,
                            )}")`,
                        }}
                    >
                        {option?.icon && option?.icon(iconStyle)}
                        <Card.Meta
                            title={option.name}
                            description={option.description}
                        />
                    </Card>
                ))}
            </div>
        );
    },
);

export default CardSelector;
