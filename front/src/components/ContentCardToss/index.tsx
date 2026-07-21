import { theme, Typography } from "antd";
import { Content } from "antd/es/layout/layout";
import { CSSProperties, FC, ReactNode } from "react";

interface ContentCardTossProps {
    children: ReactNode;
    title?: string | ReactNode;
    color?: string;
    style?: CSSProperties;
}

export const ContentCardToss: FC<ContentCardTossProps> = ({
    children,
    title,
    color,
    style,
}) => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <>
            {title && typeof title === "string" ? (
                <div style={{ paddingBottom: 24 }}>
                    <Typography.Title
                        style={{ fontSize: 19, textAlign: "center" }}
                    >
                        {title}
                    </Typography.Title>
                </div>
            ) : (
                title
            )}
            <Content
                style={{
                    ...style,
                    padding: 24,
                    background: color ?? colorBgContainer,
                    borderRadius: borderRadiusLG,
                }}
            >
                {children}
            </Content>
        </>
    );
};
