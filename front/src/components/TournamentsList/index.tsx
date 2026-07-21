import { Button, Col, Row, Skeleton } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { TODAY } from "@/shared/lib/dayjs";
import { useGetTournamentsQuery } from "@/services/Tournament/tournament";
import { EmptyList } from "./EmptyList";
import { ActiveItem, CompletedItem } from "../TournamentsItem";

import s from "./style.module.scss";

interface TournamentsListProps {
    isActive: boolean;
}

export const TournamentsList = ({ isActive }: TournamentsListProps) => {
    const {
        currentData: tournaments,
        isLoading,
        isFetching,
    } = useGetTournamentsQuery(
        {
            page: 1,
            per_page: 100,
            ...(isActive && { lifecycle_status__in: [1, 2, 3, 4, 7, 8] }),
            ...(!isActive && { lifecycle_status__in: [5, 6] }),
            can_manage: true,
        },
        { refetchOnMountOrArgChange: true },
    );

    if (isLoading) {
        return <Skeleton active />;
    }

    return (
        <div className={s.tournaments}>
            {!!tournaments?.payload?.length && (
                <Row gutter={[0, 24]}>
                    {tournaments?.payload.map((tournament) => (
                        <Col key={tournament.id} span={24}>
                            {isActive ? (
                                <ActiveItem
                                    isSettingsButtonVisible={true}
                                    tournament={tournament}
                                />
                            ) : (
                                <CompletedItem tournament={tournament} />
                            )}
                        </Col>
                    ))}
                    {isActive && (
                        <Col span={24}>
                            <div className={s.newTournament}>
                                <Row>
                                    <Col xs={4} lg={2}>
                                        <Button
                                            href="/tournaments/create"
                                            shape="circle"
                                            icon={<PlusOutlined />}
                                            size="large"
                                        />
                                    </Col>
                                    <Col xs={18} lg={22}>
                                        <p>Создать турнир</p>
                                        <p>
                                            Вы можете создавать и проводить
                                            несколько турниров одновременно с
                                            подключенной подпиской PRO
                                        </p>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    )}
                </Row>
            )}
            {!isLoading && !isFetching && !tournaments?.payload?.length && (
                <EmptyList isActive={isActive} />
            )}
        </div>
    );
};
