"use client";

import { Button } from "antd";
import { CloseOutlined } from "@ant-design/icons";

import { ComplaintModel } from "@/shared/types/models/Complaints";
import { useUpdateMatchComplaintsMutation } from "@/services/Complaints/complaints";

import s from "../style.module.scss";

export interface ComplaintsItemProps {
    complaint: ComplaintModel;
    isAdmin: boolean;
}

const ComplaintsItem = ({ complaint, isAdmin }: ComplaintsItemProps) => {
    const [changeStatus] = useUpdateMatchComplaintsMutation();

    return (
        <>
            {isAdmin && `${complaint.author.login}: `}
            <div className={s.item}>
                <div className={s.comment}>{complaint.comment}</div>
                {isAdmin && (
                    <Button
                        icon={<CloseOutlined />}
                        onClick={(e) => {
                            e.stopPropagation();
                            changeStatus({
                                status: 4,
                                seriesId: complaint.series_id,
                                matchId: complaint.match.id,
                                complaintId: complaint.id,
                                tournamentId: `${complaint.tournament_id}`,
                            });
                        }}
                    />
                )}
            </div>
        </>
    );
};

export { ComplaintsItem };
