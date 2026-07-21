"use client";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import s from "./style.module.scss";
import { useGetTournamentByIdQuery } from "@/services/Tournament/tournament";
import { Spin } from "antd";

const ReglamentPage = ({ params }: { params: { tournamentId: string } }) => {
    const { currentData, isLoading } = useGetTournamentByIdQuery({
        id: params.tournamentId,
    });
    return (
        <>
            {isLoading && <Spin />}
            <Markdown className={s.markdown} rehypePlugins={[rehypeRaw]}>
                {currentData?.regulation}
            </Markdown>
        </>
    );
};

export default ReglamentPage;
