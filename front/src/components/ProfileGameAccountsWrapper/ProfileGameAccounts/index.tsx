import { Card, Col, Empty, Flex, Row, Skeleton, Typography } from "antd";
import Link from "next/link";
import { useIsCurrentUser } from "@/shared/hooks/useIsCurrentUser";
import { useParams } from "next/navigation";
import { PlatformIcon } from "@/components/PlatformIcon";
import { useGetProfileGames } from "@/shared/hooks/useGetProfileGames";
import { ContentCard } from "@/components/ContentCard";
import { GamerModel } from "@/shared/types/models/Games";

export interface ProfileGameAccountsProps {
    userId: string;
    data: GamerModel[] | undefined;
    isLoading: boolean;
}

export const ProfileGameAccounts = ({
    userId,
    data,
    isLoading,
}: ProfileGameAccountsProps) => {
    const isCurrentUser = useIsCurrentUser(userId);
    return (
        <>
            {isLoading && <Skeleton.Input />}
            {Array.isArray(data) && data.length === 0 && (
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="Список игр пуст"
                >
                    {isCurrentUser && (
                        <Link href={"/panel/games"}>Добавить</Link>
                    )}
                </Empty>
            )}
            {data && (
                <Row gutter={[16, 16]}>
                    {data?.map((item) => (
                        <Col xs={24} sm={12} key={item.id}>
                            <Card
                                style={{ backgroundColor: "#090019" }}
                                type={"inner"}
                            >
                                <Row align={"middle"} justify={"space-between"}>
                                    <Col>
                                        <Typography.Title level={4}>
                                            <Flex gap={8}>
                                                {item.login}
                                                <PlatformIcon
                                                    size={30}
                                                    platformName={
                                                        item.platform.name
                                                    }
                                                />{" "}
                                            </Flex>
                                        </Typography.Title>
                                    </Col>
                                    <Col>
                                        {" "}
                                        <Typography.Title level={4}>
                                            {item.game.name}
                                        </Typography.Title>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </>
    );
};
