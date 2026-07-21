import { useGetCurrentUserQuery } from "@/services/User/user";
import { useGetProfileTeamsQuery } from "@/services/Teams";
import { skipToken } from "@reduxjs/toolkit/query";
import { Col, Empty, Row } from "antd";
import { TeamItem } from "./TeamItem";
import { useFormContext, useWatch } from "react-hook-form";

export const ProfileTeamsList = () => {
    const { control } = useFormContext();
    const gameId = useWatch({
        control,
        name: "gameId",
        defaultValue: "all",
    });
    const { currentData } = useGetCurrentUserQuery();

    const { data } = useGetProfileTeamsQuery(
        currentData
            ? {
                  creator_id: currentData.id,
                  game_id: gameId === "all" ? undefined : gameId,
              }
            : skipToken,
    );

    if (data && data.payload.length === 0) {
        return <Empty />;
    }

    return (
        <Row gutter={[16, 16]}>
            <Col xs={24}>
                {data?.payload.map((item) => (
                    <TeamItem {...item} key={item.id} />
                ))}
            </Col>
        </Row>
    );
};
