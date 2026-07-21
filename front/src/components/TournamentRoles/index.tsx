import {
    useGetTournamentRolesQuery,
    useRemoveTournamentRoleMutation,
} from "@/services/Roles/roles";
import { App, Avatar, Button, Empty, List, Popconfirm, Typography } from "antd";
import { userMock } from "@/shared/constants/userMock";
import { TOURNAMENT_ROLES_MAP } from "@/shared/types/models/Tournament";
import { useTournamentRole } from "@/shared/hooks/useTournamentRole";
import { TOURNAMENT_ROLES_VALUE } from "@/shared/constants/roles";
import { getErrorMessage } from "@/shared/lib/getErrorMessage";

interface TournamentRolesProps {
    tournamentId: string;
}

export const TournamentRoles = ({ tournamentId }: TournamentRolesProps) => {
    const { message } = App.useApp();

    const { currentData } = useGetTournamentRolesQuery({ tournamentId });
    const { isTournamentOrganizer } = useTournamentRole(tournamentId);
    const [removeRole] = useRemoveTournamentRoleMutation();

    const handleRoleRemoval = (roleId: string) => {
        removeRole({ tournamentId, roleId }).then((res) => {
            if ("data" in res) {
                message.success("Полномочия модератора удалены");
            }
            if ("error" in res && res.error) {
                getErrorMessage(res.error, message);
            }
        });
    };
    return (
        <List>
            {currentData?.payload?.length === 0 && (
                <Empty
                    imageStyle={{ height: "fit-content" }}
                    image={<Typography.Title>🍃</Typography.Title>}
                    description={"Модераторы не назначены"}
                ></Empty>
            )}
            {currentData?.payload.map((role) => (
                <List.Item
                    key={role.id}
                    actions={
                        isTournamentOrganizer
                            ? role.role_type === TOURNAMENT_ROLES_MAP.MODERATOR
                                ? [
                                      <Popconfirm
                                          title="Подтвердите удаление"
                                          description="У пользователя будут отобраны полномочия модератора"
                                          okText="Удалить"
                                          cancelText="Отмена"
                                          onConfirm={() =>
                                              handleRoleRemoval(role.id)
                                          }
                                      >
                                          <Button danger>Удалить</Button>
                                      </Popconfirm>,
                                  ]
                                : []
                            : []
                    }
                >
                    <List.Item.Meta
                        avatar={<Avatar src={userMock.avatar} />}
                        title={`${role.user.surname} ${role.user.name}`}
                        description={TOURNAMENT_ROLES_VALUE[role.role_type]}
                    />
                </List.Item>
            ))}
        </List>
    );
};
