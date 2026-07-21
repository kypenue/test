import { useMemo, useState } from "react";
import { Spin, Table } from "antd";
import { useGetLeaderboardQuery } from "@/services/Rating";
import { useFormContext, useWatch } from "react-hook-form";
import { skipToken } from "@reduxjs/toolkit/query";

interface Props {
    gameId: number;
}

const COLUMNS = [
    {
        title: "#",
        dataIndex: "position",
    },
    {
        title: "Ник",
        dataIndex: "login",
    },
    {
        title: "Рейтинг",
        dataIndex: "rating",
    },
    {
        title: "Количество игр",
        dataIndex: "games_count",
    },
];

export const RatingTable = ({ gameId }: Props) => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(100);

    const { data, isLoading } = useGetLeaderboardQuery({
        game_id: gameId,
        page,
        per_page: pageSize,
    });

    if (isLoading) {
        return <Spin fullscreen />;
    }

    if (!data) {
        return null;
    }
    return (
        <Table
            dataSource={data.payload}
            columns={COLUMNS}
            loading={isLoading}
            pagination={{
                pageSize,
                onChange: (page, pageSize) => {
                    setPage((prev) => (page === prev ? prev : page));
                    setPageSize((prev) =>
                        pageSize === prev ? prev : pageSize,
                    );
                },
                total: data.total_count,
            }}
        />
    );
};
