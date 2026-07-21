import React from "react";
import { useParams } from "next/navigation";
import { Table, Typography, Tag, Avatar, Flex, Skeleton } from "antd";
import type { ColumnsType } from "antd/es/table";
import { UserOutlined, TrophyOutlined } from "@ant-design/icons";
import { useGetForecastBetRatingQuery } from "@/services/Tournament/tournament";
import { ForecastBetRatingItem } from "@/shared/types/models/Tournament";

const { Text } = Typography;

export const ForecastBetRating: React.FC = () => {
    const { tournamentId } = useParams<{ tournamentId: string }>();
    const { data, isLoading } = useGetForecastBetRatingQuery({ tournamentId });

    const columns: ColumnsType<ForecastBetRatingItem> = [
        {
            title: " ",
            dataIndex: "position",
            key: "position",
            width: 40,
            render: (
                _position: number,
                record: ForecastBetRatingItem,
                index,
            ) => {
                const position = index + 1;
                const positionColor =
                    position === 1
                        ? "gold"
                        : position === 2
                          ? "silver"
                          : position === 3
                            ? "#cd7f32"
                            : undefined;

                return (
                    <Flex justify="center" gap={8}>
                        {position <= 3 && (
                            <TrophyOutlined style={{ color: positionColor }} />
                        )}
                        {position > 3 && (
                            <Text style={{ fontWeight: "normal" }}>
                                {position}
                            </Text>
                        )}
                    </Flex>
                );
            },
        },
        {
            title: "Участник",
            dataIndex: "user",
            key: "user",
            render: (user) => (
                <Flex align="center" gap={8}>
                    <Avatar size="small" icon={<UserOutlined />} />
                    <Text>{`${user.name} ${user.surname}`}</Text>
                </Flex>
            ),
        },
        {
            title: "Очки",
            dataIndex: "rating",
            key: "rating",
            width: 100,
            render: (points: number) => (
                <Tag
                    color="blue"
                    style={{
                        fontWeight: "bold",
                        fontSize: "14px",
                        padding: "2px 10px",
                    }}
                >
                    {points}
                </Tag>
            ),
        },
    ];

    if (isLoading) {
        return <Skeleton active />;
    }

    if (!data || !data.payload.length) {
        return <Typography.Text>Пока что данных нет</Typography.Text>;
    }

    return (
        <div>
            <Table
                columns={columns}
                dataSource={data.payload}
                rowKey={(record) => `${record.user.id}`}
                pagination={false}
            />
        </div>
    );
};
