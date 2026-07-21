import {
    FormatPainterOutlined,
    MessageOutlined,
    SmileOutlined,
    TeamOutlined,
    ToolOutlined,
    UsergroupAddOutlined,
} from "@ant-design/icons";

export const menuItems = [
    {
        key: "",
        icon: <ToolOutlined />,
        label: "Управление",
    },
    {
        key: "teams",
        icon: <TeamOutlined />,
        label: "Команды",
    },
    {
        key: "description",
        icon: <FormatPainterOutlined />,
        label: "Описание",
    },
    {
        key: "participants",
        icon: <UsergroupAddOutlined />,
        label: "Участники",
    },
    {
        key: "moderators",
        icon: <SmileOutlined />,
        label: "Модераторы",
    },
    {
        key: "complains",
        icon: <MessageOutlined />,
        label: "Жалобы",
    },
];
