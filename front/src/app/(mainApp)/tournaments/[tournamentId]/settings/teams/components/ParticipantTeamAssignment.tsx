import { Button, Select, Typography } from "antd";
import { useState } from "react";
import { useParams } from "next/navigation";
import {
    useGetTournamentTeamsQuery,
    useAssignTeamToParticipantMutation,
} from "@/services/Teams";
import { ParticipantsModel } from "@/shared/types/models/Tournament";
import { BiPencil } from "react-icons/bi";
import { useDebounceValue } from "usehooks-ts";
import { CloseOutlined } from "@ant-design/icons";

interface ParticipantTeamAssignmentProps {
    participant: ParticipantsModel;
}

const accessTypeLabel = (type?: string) => {
    if (type === "TOURNAMENT_INTERNAL") return "Дополнительная";
    if (type === "TOURNAMENT") return "Основная";
    return "";
};

export const ParticipantTeamAssignment = ({
    participant,
}: ParticipantTeamAssignmentProps) => {
    const params = useParams<{ tournamentId: string }>();
    const [isEditing, setIsEditing] = useState(false);
    const [search, setSearch] = useState("");
    const [debouncedSearch] = useDebounceValue(search, 400);

    const { data: teams, isFetching } = useGetTournamentTeamsQuery({
        tournament_id: Number(params.tournamentId),
        per_page: 100,
        ...(debouncedSearch && { search: debouncedSearch }),
    });

    const [assignTeam, { isLoading: isAssigning }] =
        useAssignTeamToParticipantMutation();

    const handleTeamSelect = async (teamId: string) => {
        try {
            await assignTeam({
                tournament_id: Number(params.tournamentId),
                participant_id: participant.id,
                team_id: teamId,
            }).unwrap();
            setIsEditing(false);
        } catch (error) {
            console.error("Error assigning team:", error);
        }
    };

    if (isEditing) {
        return (
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    justifyContent: "flex-end",
                }}
            >
                <Select
                    showSearch
                    placeholder="Выберите команду"
                    style={{ maxWidth: 300, width: "50%" }}
                    onSearch={setSearch}
                    filterOption={false}
                    loading={isFetching || isAssigning}
                    onSelect={handleTeamSelect}
                    options={teams?.payload?.map((team) => ({
                        value: team.id,
                        label: team.name,
                        accessType: team.access_type,
                    }))}
                    optionRender={(option) => (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <span>{option.label}</span>
                            <Typography.Text
                                type="secondary"
                                style={{ fontSize: 12 }}
                            >
                                {accessTypeLabel(option.data.accessType)}
                            </Typography.Text>
                        </div>
                    )}
                />
                <Button
                    icon={<CloseOutlined />}
                    size="small"
                    type="text"
                    onClick={() => setIsEditing(false)}
                />
            </div>
        );
    }

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                justifyContent: "flex-end",
            }}
        >
            <Typography.Text type={participant.team ? undefined : "secondary"}>
                {participant.team
                    ? participant.team.name
                    : "Команда не выбрана"}
            </Typography.Text>
            <Button
                size="small"
                icon={<BiPencil />}
                type="text"
                onClick={() => setIsEditing(true)}
            />
        </div>
    );
};
