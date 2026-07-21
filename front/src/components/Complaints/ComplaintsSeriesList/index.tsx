"use client";
import { Skeleton } from "antd";

import { useGetComplaintsBySeriesQuery } from "@/services/Complaints/complaints";
import { ComplaintsList } from "../ComplaintsList";

import s from "../style.module.scss";

export interface ComplaintsSeriesListProps {
    isAdmin: boolean;
    params: { tournamentId: string; seriesId: string };
}

const ComplaintsSeriesList = ({
    params,
    isAdmin,
}: ComplaintsSeriesListProps) => {
    const { currentData: complaints, isLoading } =
        useGetComplaintsBySeriesQuery({ ...params });

    if (isLoading) {
        return <Skeleton active />;
    }

    if (!isLoading && !complaints) {
        return null;
    }

    return (
        <div className={s.card}>
            <p className={s.title}>жалобы</p>
            {!isLoading && (
                <ComplaintsList complaints={complaints} isAdmin={isAdmin} />
            )}
        </div>
    );
};

export { ComplaintsSeriesList };