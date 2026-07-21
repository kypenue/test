import { Flex, type FlexProps, Skeleton } from "antd";

import s from "./style.module.scss";
import classNames from "classnames";

interface StatCardProps extends Omit<FlexProps, "children"> {
    title: string;
    value: number | string | undefined;
    isLoading: boolean;
    size?: "default" | "large";
    position?: "top-left" | "center";
    wrap?: boolean;
    isWLD?: boolean;
    isWins?: boolean;
}

export const StatCard = ({
    title,
    value,
    size = "default",
    position = "center",
    wrap = false,
    isWLD = false,
    isWins = false,
    isLoading,
    ...rest
}: StatCardProps) => {
    return (
        <Flex
            vertical
            className={classNames(s.card, {
                [s.large]: size === "large",
                [s.wrap]: wrap,
                [s.wld]: isWLD,
                [s.wins]: isWins,
            })}
            {...rest}
        >
            <h3>{title}</h3>
            {value === undefined || isLoading ? (
                <Skeleton paragraph={{ rows: 1, width: "100%" }} />
            ) : (
                <p>{value?.toString()}</p>
            )}
        </Flex>
    );
};
