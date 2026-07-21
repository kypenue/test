import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { useParams } from "next/navigation";
import { useGetTournamentByIdQuery } from "@/services/Tournament/tournament";
import { Skeleton } from "antd";
import s from "./style.module.scss";
import { useEffect, useState } from "react";
import { ReadOnlyEditor } from "@/components/Editor/ReadOnlyEditor";

export const TournamentInformation = () => {
    const { tournamentId } = useParams<{ tournamentId: string }>();
    const [isMarkdown, setMarkdown] = useState<boolean | null>(null);

    const { currentData, isLoading } = useGetTournamentByIdQuery({
        id: tournamentId,
    });

    useEffect(() => {
        try {
            console.log(currentData && JSON.parse(currentData?.rules_info));
            setMarkdown(false);
        } catch (e) {
            console.error(e);
            setMarkdown(true);
        }
    }, [currentData]);

    return (
        <div>
            {isLoading && <Skeleton active />}
            {!isLoading &&
                isMarkdown !== null &&
                currentData &&
                (isMarkdown ? (
                    <Markdown
                        className={s.markdown}
                        rehypePlugins={[rehypeRaw]}
                    >
                        {currentData.rules_info}
                    </Markdown>
                ) : (
                    <ReadOnlyEditor value={currentData.rules_info} />
                ))}
        </div>
    );
};
