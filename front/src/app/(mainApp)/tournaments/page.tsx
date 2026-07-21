"use client";
import {
    App,
    Button,
    Col,
    Empty,
    Flex,
    Input,
    Layout,
    Pagination,
    Row,
    Spin,
    Tabs,
    Typography,
} from "antd";
import s from "@/app/(mainApp)/s/style.module.scss";
import { useGetTournamentsQuery } from "@/services/Tournament/tournament";
import { TournamentMiniCard } from "@/components/TournamentMiniCard";
import { useState } from "react";
import { tournamentTabs } from "@/app/(mainApp)/tournaments/utils";
import { useDebounceCallback, useDebounceValue } from "usehooks-ts";
import { SearchOutlined } from "@ant-design/icons";
import { TODAY } from "@/shared/lib/dayjs";
import { TournamentCard } from "@/components/TournamentCard";
import { PaginationConfig } from "antd/es/pagination";
import { EmptyPairs } from "@/components/TournamentPlayingSwiss/EmptyPairs";

const TournamentsPage = () => {
    const [activeTab, setActiveTab] = useState("rating");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    const setDebouncedSearch = useDebounceCallback(setSearch, 500);

    const { currentData, isFetching, data } = useGetTournamentsQuery({
        page: page,
        per_page: perPage,
        search,
        ...(activeTab === "rating" && { payment_type__neq: "FREE", lifecycle_status__in: [1,2,3,4,7,8] }),
        ...(activeTab === "user" && { payment_type: "FREE",  lifecycle_status__in: [1,2,3,4,7,8] }),
        ...(activeTab === "finished" && { lifecycle_status__in: [5] }),
        order_by: "-created_at",
    });

    const handlePerPageChange: PaginationConfig["onShowSizeChange"] = (
        _current,
        size,
    ) => {
        setPage(1);
        setPerPage(size);
    };

    return (
        <Layout.Content className={s.body}>
            <Row
                style={{ width: "100%", paddingTop: "10vh" }}
                justify="center"
                gutter={[0, 16]}
            >
                <Col span={24}>
                    <Typography.Title className={s.title}>
                        Турниры
                    </Typography.Title>
                    <Typography.Text className={s.subTitle}>
                        Соревнуйтесь с тысячами игроков по всему миру и
                        создавайте свои турниры
                    </Typography.Text>
                </Col>
            </Row>
            <Row style={{ width: "100%", paddingTop: "5vh" }}>
                <Input
                    placeholder="Название турнира"
                    size={"large"}
                    variant="filled"
                    suffix={<SearchOutlined />}
                    onChange={(e) => {
                        setDebouncedSearch(e.target.value);
                    }}
                />
            </Row>
            <Row style={{ width: "100%", paddingTop: "2vh" }} gutter={[0, 16]}>
                <Col span={24}>
                    <Tabs
                        onChange={setActiveTab}
                        activeKey={activeTab}
                        items={tournamentTabs}
                    />
                </Col>
            </Row>
            {isFetching && (
                <Flex justify={"center"}>
                    <Spin style={{ width: "100%" }} />
                </Flex>
            )}
            <Row gutter={[16, 16]} justify={"center"}>
                {currentData?.payload?.length === 0 && !isFetching && (
                    <Empty
                        imageStyle={{ height: "fit-content" }}
                        image={<Typography.Title>🍃</Typography.Title>}
                        description={"Турниры не найдены"}
                    />
                )}
                {currentData?.payload?.map((item) => (
                    <Col xs={24} key={item.id}>
                        <TournamentCard tournament={item} />
                    </Col>
                ))}
            </Row>
            <div className={s.pagination}>
                <Pagination
                    align="center"
                    showSizeChanger
                    pageSize={perPage}
                    onShowSizeChange={handlePerPageChange}
                    onChange={setPage}
                    total={data?.total_count}
                />
            </div>
        </Layout.Content>
    );
};

export default TournamentsPage;
