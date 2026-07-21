import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { useParams } from "next/navigation";
import { useGetTournamentRegulationsQuery } from "@/services/Tournament/tournament";
import { Skeleton } from "antd";
import s from "./style.module.scss";
import { useEffect, useState } from "react";
import { ReadOnlyEditor } from "@/components/Editor/ReadOnlyEditor";
import {
    parseBackendString,
    Parsed,
} from "@/components/Editor/utils/checkIsPlate";

export const TournamentRegulations = () => {
    const { tournamentId } = useParams<{ tournamentId: string }>();
    const [valueType, setValueType] = useState<Parsed["kind"] | null>(null);

    const { currentData, isLoading } = useGetTournamentRegulationsQuery({
        id: tournamentId,
    });

    useEffect(() => {
        if (currentData) {
            const whichKind = parseBackendString(currentData.regulation);
            console.log(whichKind);
            setValueType(
                whichKind.kind === "json-other" ? null : whichKind.kind,
            );
        }
    }, [currentData]);

    return (
        <div>
            {isLoading && <Skeleton active />}
            {valueType === null && <p>Регламент пока недоступен</p>}
            {valueType === "markdown" && (
                <Markdown className={s.markdown} rehypePlugins={[rehypeRaw]}>
                    {currentData!.regulation}
                </Markdown>
            )}
            {valueType === "plate" && (
                <ReadOnlyEditor value={currentData!.regulation} />
            )}
        </div>
    );
};
