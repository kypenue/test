"use client";
import { Col, Row, Spin } from "antd";

import { useGetComplaintsByMatchQuery } from "@/services/Complaints/complaints";
import { ComplaintsList } from "../ComplaintsList";

import s from "../style.module.scss";

export interface ComplaintsMatchListProps {
    isAdmin: boolean;
    params: { tournamentId: string; seriesId: string; matchId: string };
}

const ComplaintsMatchList = ({ params, isAdmin }: ComplaintsMatchListProps) => {
    const { currentData: complaints, isLoading } = useGetComplaintsByMatchQuery(
        { ...params },
    );

    return (
        <div className={s.card}>
            <p className={s.title}>жалобы</p>
            {isLoading && (
                <Row justify={"center"}>
                    <Col span={24}>
                        <Spin />
                    </Col>
                </Row>
            )}
            {!isLoading && (
                <ComplaintsList complaints={complaints} isAdmin={isAdmin} />
            )}
        </div>
    );
};

export { ComplaintsMatchList };
