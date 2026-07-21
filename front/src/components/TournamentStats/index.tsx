import { useGetGamerStatsByTournamentQuery } from "@/services/Games/games";
import { Col, Collapse, type CollapseProps, Empty, Flex, Row } from "antd";
import { useMemo, useState } from "react";
import { TournamentItem } from "./TournamentItem";
import { skipToken } from "@reduxjs/toolkit/query";

import s from "./TournamentStats.module.scss";
import { GameAccountsDropDown } from "@/components/GameAccountsDropDown";
import { ContentCard } from "@/components/ContentCard";

export const TournamentStats = () => {
    const [accountId, setAccountId] = useState<string | null>(null);

    const { data } = useGetGamerStatsByTournamentQuery(accountId ?? skipToken);

    const items: CollapseProps["items"] = useMemo(
        () =>
            data?.map((item) => ({
                key: item.tournament.id,
                label: item.tournament.name,
                children: <TournamentItem {...item} />,
                showArrow: false,
            })),
        [data, accountId],
    );

    return (
        <ContentCard>
            <Row align={"middle"} gutter={[24, 24]}>
                <Col span={24}>
                    <Flex vertical gap={16}>
                        <Row>
                            <Col span={24} sm={6}>
                                <GameAccountsDropDown
                                    setAccount={setAccountId}
                                    accountId={accountId}
                                />
                            </Col>
                        </Row>
                        {accountId ? (
                            !items?.length ? (
                                <Empty
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    description="Пользователь не принимал участие в турнирах"
                                />
                            ) : (
                                <Collapse
                                    items={items}
                                    className={s.collapse}
                                />
                            )
                        ) : (
                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description="Необходимо выбрать аккаунт"
                            />
                        )}
                    </Flex>
                </Col>
            </Row>
        </ContentCard>
    );
};
