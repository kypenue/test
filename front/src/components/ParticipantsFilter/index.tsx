import { Badge, Radio, RadioGroupProps } from "antd";
import { useGetTournamentParticipantsQuery } from "@/services/Tournament/tournament";
import { STATUS_REG_TEXT } from "@/shared/lib/statusMapper";
import { CSSProperties, useMemo } from "react";
import { isNumber } from "lodash";

const options = ({
    all,
    declined,
    participant,
    waiting,
}: {
    all: number;
    declined: number;
    participant: number;
    waiting: number;
}) => [
    {
        value: 0,
        label: (
            <>
                Все&nbsp;
                {!!all && (
                    <Badge
                        size={"small"}
                        overflowCount={Number.MAX_SAFE_INTEGER}
                        count={all}
                        color={"cyan"}
                    />
                )}
            </>
        ),
    },
    {
        value: 1,
        label: (
            <>
                {STATUS_REG_TEXT[1]}&nbsp;
                {!!waiting && (
                    <Badge
                        size={"small"}
                        count={waiting}
                        overflowCount={Number.MAX_SAFE_INTEGER}
                        color={"orange"}
                    />
                )}
            </>
        ),
    },
    {
        value: 2,
        label: (
            <>
                {STATUS_REG_TEXT[2]}&nbsp;
                {!!declined && (
                    <Badge
                        size={"small"}
                        overflowCount={Number.MAX_SAFE_INTEGER}
                        count={declined}
                        color="red"
                    />
                )}
            </>
        ),
    },
    {
        value: 3,
        label: (
            <>
                {STATUS_REG_TEXT[3]}&nbsp;
                {!!participant && (
                    <Badge
                        size={"small"}
                        count={participant}
                        overflowCount={Number.MAX_SAFE_INTEGER}
                        color="lime"
                    />
                )}
            </>
        ),
    },
];

interface ParticipantsFilterProps {
    id: string;
    value: number;
    onChange: RadioGroupProps["onChange"];
    style?: CSSProperties;
}

export const ParticipantsFilter = ({
    id,
    value,
    onChange,
    style,
}: ParticipantsFilterProps) => {
    const { currentData: all } = useGetTournamentParticipantsQuery({
        id,
        per_page: 1,
        page: 1,
    });
    const { currentData: waiting } = useGetTournamentParticipantsQuery({
        id,
        per_page: 1,
        page: 1,
        status: 1,
    });
    const { currentData: declined } = useGetTournamentParticipantsQuery({
        id,
        per_page: 1,
        page: 1,
        status: 2,
    });
    const { currentData: participant } = useGetTournamentParticipantsQuery({
        id,
        per_page: 1,
        page: 1,
        status: 3,
    });
    const memoizedOptions = useMemo(() => {
        if (
            isNumber(all?.total_count) &&
            isNumber(declined?.total_count) &&
            isNumber(participant?.total_count) &&
            isNumber(waiting?.total_count)
        ) {
            return options({
                all: all?.total_count,
                declined: declined?.total_count,
                participant: participant?.total_count,
                waiting: waiting?.total_count,
            });
        }
        return options({
            all: 0,
            declined: 0,
            participant: 0,
            waiting: 0,
        });
    }, [all, declined, participant, waiting]);
    return (
        <Radio.Group
            options={memoizedOptions}
            defaultValue="Apple"
            optionType="button"
            buttonStyle="solid"
            style={style}
            size={"large"}
            onChange={onChange}
            value={value}
        />
    );
};
