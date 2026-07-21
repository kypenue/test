"use client";
import { useMemo } from "react";
import { Col, Empty, Row, Typography } from "antd";

import { useGetCurrentUserQuery } from "@/services/User/user";
import { ComplaintsItem } from "../ComplaintsItem";
import { getDeclinations } from "@/shared/lib/getDiclinations";
import { ComplaintModel } from "@/shared/types/models/Complaints";

import s from "../style.module.scss";

export interface ComplaintsListProps {
    isAdmin: boolean;
    complaints: Array<ComplaintModel> | undefined;
}

const ComplaintsList = ({ complaints, isAdmin }: ComplaintsListProps) => {
    const { currentData: user } = useGetCurrentUserQuery();

    const mineComplaints = useMemo(() => {
        if (user && complaints && complaints.length) {
            return complaints.filter(
                (complaint) => !!complaint.author?.id && complaint.status !== 4,
            );
        }
        return 0;
    }, [user, complaints]);

    const participantComplaints = useMemo(() => {
        if (user && complaints && complaints.length) {
            return complaints.filter(
                (complaint) => !complaint.author?.id && complaint.status !== 4,
            );
        }
        return 0;
    }, [user, complaints]);

    const complaintsList = useMemo(() => {
        if (isAdmin) {
            return complaints?.filter((complaint) => complaint.status !== 4);
        }
        return mineComplaints;
    }, [mineComplaints, complaints]);

    return (
        <Row gutter={[8, 24]}>
            {!!complaintsList && !!complaintsList.length && (
                <Row gutter={[16, 24]}>
                    {complaintsList.map((complaint) => (
                        <Col span={24}>
                            <ComplaintsItem
                                complaint={complaint}
                                isAdmin={isAdmin}
                            />
                        </Col>
                    ))}
                </Row>
            )}
            {!isAdmin && (
                <Col span={24}>
                    {!!participantComplaints &&
                        !!participantComplaints.length && (
                            <p className={s.partisipantComplaints}>
                                Есть{" "}
                                {getDeclinations({
                                    count: participantComplaints.length,
                                    few: "жалобы",
                                    many: "жалоб",
                                    one: "жалоба",
                                })}{" "}
                                от соперника
                            </p>
                        )}
                </Col>
            )}
            {complaints && complaints.length === 0 && (
                <Col span={24}>
                    <Empty
                        imageStyle={{ height: "fit-content" }}
                        image={<Typography.Title>🤝</Typography.Title>}
                        description={"Жалоб нет"}
                    />
                </Col>
            )}
        </Row>
    );
};

export { ComplaintsList };
