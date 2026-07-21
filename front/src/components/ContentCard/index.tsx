import { Button, Flex, theme, Typography } from "antd";
import { Content } from "antd/es/layout/layout";
import { FC, ReactNode } from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

interface ContentCardProps {
    children: ReactNode;
    title?: string | ReactNode;
    color?: string;
    backHref?: string;
    isBackButtonEnabled?: boolean;
    style?: React.CSSProperties;
}

export const ContentCard: FC<ContentCardProps> = ({
    children,
    title,
    color,
    backHref,
    isBackButtonEnabled,
    style,
}) => {
    const router = useRouter();

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const handleBack = () => {
        router.back();
    };
    return (
        <Content
            style={{
                padding: 24,
                background: color ?? colorBgContainer,
                borderRadius: borderRadiusLG,
                ...style,
            }}
        >
            {title && typeof title === "string" ? (
                <Flex
                    justify={"space-between"}
                    align={"center"}
                    style={{ paddingBottom: 24 }}
                >
                    {isBackButtonEnabled ? (
                        <Button
                            type={"link"}
                            onClick={backHref ? () => {} : handleBack}
                            href={backHref}
                            icon={<ArrowLeftOutlined />}
                        >
                            Назад
                        </Button>
                    ) : (
                        <div style={{ width: 76 }}>&nbsp;</div>
                    )}
                    <Typography.Title
                        style={{ fontSize: 19, textAlign: "center" }}
                    >
                        {title}
                    </Typography.Title>
                    <div style={{ width: 76 }}>&nbsp;</div>
                </Flex>
            ) : (
                title
            )}
            {children}
        </Content>
    );
};
