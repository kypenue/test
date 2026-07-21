import { ColumnsType } from "antd/es/table";
import { ParticipantsModel } from "@/shared/types/models/Tournament";
import Link from "next/link";
import { Button } from "antd";

export const generateColumns = (
    changeStatus: (blockId: number, userId: number) => void,
): ColumnsType<ParticipantsModel> => [
    {
        title: "Пользователь",
        dataIndex: ["user"],
        key: "user",
        render: (item: ParticipantsModel["account"]["user"]) => {
            return (
                <>
                    <Link href={`/account/${item.id}`}>
                        {item?.name}&nbsp;{item?.surname}
                    </Link>
                    <br />
                </>
            );
        },
    },

    {
        title: "Действия",
        dataIndex: "actions",
        key: "actions",
        // @ts-ignore надо поправить типы в таблице на BlockedParticipants
        render: (
            item: ParticipantsModel["status"],
            record: ParticipantsModel["account"],
        ) => {
            const handleChangeStatus = () => {
                changeStatus(record.id, record.user.id);
            };
            return <Button onClick={handleChangeStatus}>Разблокировать</Button>;
        },
    },
];
