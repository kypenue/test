import { Col, Empty, Pagination, Row } from "antd";
import { useIsCurrentUser } from "@/shared/hooks/useIsCurrentUser";

import { useParams } from "next/navigation";
import { useGetUserSeriesQuery } from "@/services/Tournament/tournament";
import { useState } from "react";
import { SeriesCard } from "@/components/SeriesCard";
import { useGetCurrentUserQuery } from "@/services/User/user";
import Link from "next/link";

export const ProfileSeries = () => {
    const { currentData: currentUser } = useGetCurrentUserQuery();

    const params = useParams<{ userId: string }>();
    const isCurrentUser = useIsCurrentUser(params?.userId);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);

    const paginationData = { page: currentPage, per_page: pageSize };

    const { currentData: userSeries } = useGetUserSeriesQuery(
        {
            userId: !isCurrentUser ? params?.userId : (currentUser?.id ?? ""),
            order_by: "updated_at",
            ...paginationData,
        },
        { skip: !currentUser?.id },
    );

    const seriesData = userSeries;

    const onPageChange = (page: number) => {
        setCurrentPage(page);
    };

    const onPageSizeChange = (current: number, size: number) => {
        setPageSize(size);
        setCurrentPage(1);
    };

    return (
        <Row>
            {seriesData && (
                <>
                    <Col span={24}>
                        {Array.isArray(seriesData.payload) &&
                            seriesData.payload.length === 0 && (
                                <Empty
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    description="Пользователь не принимал участие в турнирах"
                                />
                            )}

                        <Row gutter={[16, 16]}>
                            {seriesData.payload?.map((data) => (
                                <Col xs={24} key={data.id}>
                                    <Link
                                        href={`/tournaments/${data?.tournament_id}/series/${data?.id}`}
                                    >
                                        <SeriesCard
                                            href={`/tournaments/${data?.tournament_id}/series/${data?.id}`}
                                            homePlayerAccount={data.gamer1}
                                            tournamentId={data?.tournament_id}
                                            guestPlayerAccount={data.gamer2}
                                            homeTeam={null}
                                            guestTeam={null}
                                            homePlayerMatchResult={
                                                data.gamer1_score
                                            }
                                            guestPlayerMatchResult={
                                                data.gamer2_score
                                            }
                                            matches={data.matches}
                                            type={"series"}
                                        />
                                    </Link>
                                </Col>
                            ))}
                        </Row>
                    </Col>
                    <Col span={24}>
                        <Pagination
                            current={currentPage}
                            pageSize={pageSize}
                            total={seriesData.total_count}
                            onChange={onPageChange}
                            showSizeChanger={true}
                            onShowSizeChange={onPageSizeChange}
                            align={"center"}
                            style={{ marginTop: 16, textAlign: "center" }}
                        />
                    </Col>
                </>
            )}
        </Row>
    );
};
