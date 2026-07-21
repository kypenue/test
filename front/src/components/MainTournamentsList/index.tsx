import { Skeleton, Typography } from "antd";
import { TODAY } from "@/shared/lib/dayjs";
import { useGetTournamentsQuery } from "@/services/Tournament/tournament";
import { MainTournamentCard } from "../MainTournamentCard";
import s from "./style.module.scss";

export const MainTournamentsList = () => {
    const { currentData: tournaments, isLoading } = useGetTournamentsQuery({
        page: 1,
        per_page: 1,
        tournament_end__gte: TODAY,
        lifecycle_status__in: [1, 2, 3, 4, 7, 8],
        order_by: "-created_at",
        show_recommended: true,
    });

    return (
        <div style={{ width: "100%" }}>
            {isLoading && <Skeleton.Image className={s.loadingCard} active />}
            {!isLoading &&
                !!tournaments?.payload?.length &&
                tournaments?.payload?.map((tournament) => (
                    <MainTournamentCard tournament={tournament} />
                ))}
            {!isLoading &&
                !tournaments?.payload?.length &&
               <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh'}}>
                <div>
                   <Typography.Title style={{textAlign: 'center'}} level={1}>CUPLY</Typography.Title>
                   <Typography.Text type="secondary">Современные киберспортивные турниры</Typography.Text>
                </div>

               </div>
            }</div>
    );
};
