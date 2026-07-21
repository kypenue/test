import type { ProfileTeam } from "@/services/Teams/teams.model";
import { getStaticImage } from "@/shared/lib/getStaticImage";
import {
    Button,
    Col,
    Flex,
    Popconfirm,
    Row,
    Dropdown,
    type MenuProps,
    Typography,
} from "antd";
import { ProfileTeamsForm } from "@/components/ProfileTeams/ProfileTeamsForm";
import { useToggle } from "usehooks-ts";

import s from "./TeamItem.module.css";
import { useParams } from "next/navigation";
import { useIsCurrentUser } from "@/shared/hooks/useIsCurrentUser";
import {
    useDeleteProfileTeamByIdMutation,
    useDeleteTournamentTeamMutation,
} from "@/services/Teams";
import { useCallback } from "react";
import { BiPencil, BiRecycle } from "react-icons/bi";
import { IoRemove, IoAdd, IoTrashOutline } from "react-icons/io5";
import { DownOutlined } from "@ant-design/icons";
import { MenuItemType } from "antd/es/menu/interface";

interface TeamItemProps extends ProfileTeam {
    variant?: "default" | "copy";
    onCopyTeam?: (
        team: ProfileTeam,
        accessType: "TOURNAMENT" | "TOURNAMENT_INTERNAL",
    ) => Promise<void>;
    onDeleteTeam?: (team: ProfileTeam) => Promise<void>;
}

export const TeamItem = (props: TeamItemProps) => {
    const { variant = "default", onCopyTeam, onDeleteTeam, ...item } = props;
    const [isOpen, toggleIsOpen] = useToggle(false);
    const [deleteItem] = useDeleteProfileTeamByIdMutation();

    const { userId } = useParams<{ userId: string }>();
    const isCurrentUser = useIsCurrentUser(userId);

    const deleteTeam = useCallback(() => {
        deleteItem(item.id);
    }, []);

    const isTeamAdded = Boolean(item.source_team);

    const copyMenuItems: MenuItemType[] = [
        {
            key: "TOURNAMENT",
            label: "Основная",
            onClick: () => onCopyTeam?.(item, "TOURNAMENT"),
        },
        {
            key: "TOURNAMENT_INTERNAL",
            label: "Дополнительная",
            onClick: () => onCopyTeam?.(item, "TOURNAMENT_INTERNAL"),
        },
    ];

    const renderControls = () => {
        if (variant === "copy") {
            if (isTeamAdded) {
                return (
                    <Popconfirm
                        title="Удалить команду"
                        description="Вы действительно хотите удалить команду из турнира?"
                        okText="Да"
                        cancelText="Нет"
                        onConfirm={() => onDeleteTeam?.(item)}
                    >
                        <Button block danger icon={<IoTrashOutline />} />
                    </Popconfirm>
                );
            } else {
                return (
                    <Dropdown
                        menu={{ items: copyMenuItems }}
                        placement="bottomRight"
                    >
                        <Button block type="primary">
                            Добавить <DownOutlined />
                        </Button>
                    </Dropdown>
                );
            }
        }

        // Default variant controls
        return (
            <Flex gap={16}>
                <Button onClick={toggleIsOpen}>
                    <BiPencil />
                </Button>
                <Popconfirm
                    title="Удалить команду"
                    description="Вы действительно хотите удалить команду?"
                    okText="Да"
                    cancelText="Нет"
                    onConfirm={deleteTeam}
                >
                    <Button type="primary" danger>
                        <IoTrashOutline />
                    </Button>
                </Popconfirm>
            </Flex>
        );
    };

    return (
        <Row className={s.root}>
            <Col xs={24} sm={20}>
                <Flex align={"center"} gap={8}>
                    <div
                        className={s["card__background"]}
                        style={{
                            background:
                                'url("' +
                                getStaticImage(item.image?.object_key) +
                                '")',
                        }}
                    />
                    <div>
                        <p className={s["card__title"]}>{item.name}</p>
                        {item.source_team && (
                            <Typography.Text type="secondary">
                                {
                                    copyMenuItems.find(
                                        (menu) =>
                                            menu?.key === item?.access_type,
                                    )?.label
                                }
                            </Typography.Text>
                        )}
                    </div>
                </Flex>
            </Col>
            <Col xs={24} sm={4}>
                <Flex justify="end">{renderControls()}</Flex>
            </Col>
            {isOpen && (
                <ProfileTeamsForm onClose={toggleIsOpen} teamId={item.id} />
            )}
        </Row>
    );
};
