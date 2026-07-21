import { ColumnType } from "antd/es/table/interface";
import { GamersTableColumns } from "@/shared/types/models/Games";

interface EditableColumn<RecordType> extends ColumnType<RecordType> {
    type?: string;
}

type EditableColumnType<RecordType = unknown> = Array<
    EditableColumn<RecordType>
>;

export const gamersColumns: EditableColumnType<GamersTableColumns> = [
    {
        key: "platform",
        title: "Платформа",
        dataIndex: "platform",
        width: "33%",
        align: "center",
        render: (_, record) => record.platform?.name,
    },
    {
        key: "game",
        title: "Игра",
        dataIndex: "game",
        width: "33%",
        align: "center",
        render: (_, record) => record.game?.name,
    },
];
