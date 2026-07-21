import { Input, Table, Segmented } from "antd";
import useBreakpoint from "antd/es/grid/hooks/useBreakpoint";
import { useGetTournamentParticipantsQuery } from "@/services/Tournament/tournament";
import { ParticipantsModel } from "@/shared/types/models/Tournament";
import { useMemo, useState } from "react";
import { ColumnsType } from "antd/es/table";
import { AccountCell, StatusCell, UserCell } from "@/components/ParticipantsCell";
import { useDebounceValue } from "usehooks-ts";
import s from "../style.module.scss";
import { ParticipantTeamAssignment } from "./ParticipantTeamAssignment";

const generateColumns = (isMobile: boolean): ColumnsType<ParticipantsModel> => {
    if (isMobile) {
        return [
            {
                title: "Участники",
                dataIndex: ["accounts"],
                key: "accounts",
                render: (_, record) => (
                    <div className={s.participantInfo}>
                        <div><strong>Пользователь:</strong> <UserCell user={record.account?.user} /></div>
                        <div><strong>Аккаунт:</strong> <AccountCell account={record.account} /></div>
                        <div><strong>Статус:</strong> <StatusCell status={record.status} /></div>
                    </div>
                ),
            }
        ];
    }

    return [
        {
            title: "Пользователь",
            dataIndex: ["account", "user"],
            key: "user",
            render: (user: ParticipantsModel["account"]["user"]) => (
                <UserCell user={user} />
            ),
        },
        {
            title: "Аккаунт",
            dataIndex: "account",
            key: "account",
            render: (account: ParticipantsModel["account"]) => (
                <AccountCell account={account} />
            ),
        },
        {
            title: "Команда",
            dataIndex: "team",
            align: "right",
            key: "team",
            render: (_, record) => (
                <ParticipantTeamAssignment participant={record} />
            ),
        },
    ];
};

interface ApprovedParticipantsProps {
    tournamentId: string;
}

const FILTERS = [
    { label: "Все", value: "all" },
    { label: "С командой", value: "with" },
    { label: "Без команды", value: "without" },
];

export const ApprovedParticipants = ({ tournamentId }: ApprovedParticipantsProps) => {
    const pageSize = 10;
    const breakpoints = useBreakpoint();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchValue, setSearchValue] = useState("");
    const [debouncedSearch] = useDebounceValue(searchValue, 500);
    const [teamFilter, setTeamFilter] = useState("all");
    
    const { data, isFetching } = useGetTournamentParticipantsQuery(
        {
            id: tournamentId,
            per_page: pageSize,
            order_by: "-updated_at",
            page: currentPage,
            status: 3, 
            ...(debouncedSearch && { search: debouncedSearch }),
            ...(teamFilter === "with" && { team_id__isnull: false }),
            ...(teamFilter === "without" && { team_id__isnull: true }),
        },
        { refetchOnMountOrArgChange: true },
    );

    const columns = useMemo(() => {
        return generateColumns(breakpoints.xs ?? false);
    }, [breakpoints]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
        setCurrentPage(1);
    };

    return (
        <div>
            <Segmented
                options={FILTERS}
                value={teamFilter}
                onChange={setTeamFilter}
                style={{ marginBottom: 16 }}
            />
            <Input
                placeholder="Поиск участников"
                value={searchValue}
                onChange={handleSearchChange}
                style={{ marginBottom: 16 }}
                allowClear
            />
            <Table
                dataSource={data?.payload}
                loading={isFetching}
                columns={columns}
                pagination={{
                    defaultPageSize: pageSize,
                    total: data?.total_count,
                    current: data?.page,
                    showSizeChanger: false,
                }}
                onChange={(pagination) =>
                    setCurrentPage(pagination.current ?? 0)
                }
            />
        </div>
    );
}; 