"use client";

import { useGetAllUsersQuery } from "@/services/User/user";
import { useDebounceValue } from "usehooks-ts";
import { App, Avatar, Divider, List, message, Select, Spin } from "antd";
import { useCallback, useMemo } from "react";
import { userMock } from "@/shared/constants/userMock";
import { TournamentRoles } from "@/components/TournamentRoles";
import { useAssignTournamentRoleMutation } from "@/services/Roles/roles";
import { getErrorMessage } from "@/shared/lib/getErrorMessage";
import { ContentCard } from "@/components/ContentCard";

interface ModeratorsPageProps {
    params: { tournamentId: string };
}

const ModeratorsPage = ({ params: { tournamentId } }: ModeratorsPageProps) => {
    const [debouncedUserSearch, setUserSearch] = useDebounceValue("", 500);
    const { modal } = App.useApp();

    const { currentData, isFetching } = useGetAllUsersQuery(
        { search: debouncedUserSearch || "" },
        {
            skip: !debouncedUserSearch || debouncedUserSearch?.length < 1,
            refetchOnMountOrArgChange: true,
        },
    );
    const handleUserSearch = useCallback((value: string) => {
        setUserSearch(value);
    }, []);
    const [assignRole] = useAssignTournamentRoleMutation();

    const options = useMemo(() => {
        return currentData?.payload.map((option) => ({
            value: option.id,
            label: (
                // TODO: сделать нормально
                <List>
                    <List.Item>
                        <List.Item.Meta
                            avatar={<Avatar src={userMock.avatar} />}
                            title={`${option.surname} ${option.name}`}
                            description={option.username}
                        />
                    </List.Item>
                </List>
            ),
        }));
    }, [currentData?.payload]);

    const handleModeratorClick = (value: string) => {
        setUserSearch("");
        modal.confirm({
            title: "Подтверждение",
            content: "Вы точно хотите назначить пользователя модератором?",
            onOk: () => handleRoleAssign(value),
            cancelText: "Отмена",
            closable: true,
        });
    };

    const handleRoleAssign = (userId: string) => {
        return assignRole({
            tournamentId,
            user_id: userId,
            role_type: "MODERATOR",
        }).then((res) => {
            if ("data" in res) {
                message.success("Пользователю выданы полномочия модератора");
            }
            if ("error" in res && res.error) {
                getErrorMessage(res.error, message);
            }
        });
    };

    return (
        <ContentCard>
            <Select
                value={null}
                onChange={handleModeratorClick}
                placeholder={"Поиск"}
                onSearch={handleUserSearch}
                showSearch={true}
                style={{ width: "100%" }}
                options={options}
                filterOption={() => true}
                notFoundContent={isFetching ? <Spin size="small" /> : null}
            />
            <Divider />
            <TournamentRoles tournamentId={tournamentId} />
        </ContentCard>
    );
};

export default ModeratorsPage;
