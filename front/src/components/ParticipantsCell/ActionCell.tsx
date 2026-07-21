import { Dropdown, Space } from "antd";
import { MenuItemType } from "antd/es/menu/interface";
import { DownOutlined } from "@ant-design/icons";
import { ParticipantsModel } from '@/shared/types/models/Tournament';

interface ActionCellProps {
    record: ParticipantsModel;
    changeStatus: (
        participantId: number,
        status: number,
        userId: number,
    ) => void;
}

export const ActionCell = ({ record, changeStatus }: ActionCellProps) => {

    const generateActionItems = (
        changeStatus: (status: number) => void,
    ): MenuItemType[] => {
        return [
            {
                label: "Принять",
                key: "invite",
                onClick: () => changeStatus(3),
            },
            {
                key: "decline",
                label: "Отклонить",
                onClick: () => changeStatus(2),
            },
            {
                key: "block",
                label: "Заблокировать",
                onClick: () => changeStatus(4),
            },
        ];
    };

    const handleChangeStatus = (status: number) => {
        changeStatus(record.id, status, record.account.user.id);
    };

    const items = generateActionItems(handleChangeStatus);

    return (
        <Dropdown menu={{ items }}>
            <a onClick={(e) => e.preventDefault()}>
                <Space>
                    Изменить
                    <DownOutlined />
                </Space>
            </a>
        </Dropdown>
    );
};