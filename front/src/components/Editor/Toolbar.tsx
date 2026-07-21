import { Space } from "antd";
import {
    BoldOutlined,
    ItalicOutlined,
    OrderedListOutlined,
    UnderlineOutlined,
    UnorderedListOutlined,
} from "@ant-design/icons";
import { TextStyleButton } from "@/components/Editor/ui/TextStyleButton";
import { BlockTypeButton } from "@/components/Editor/ui/BlockTypeButton";
import { HistoryButton } from "@/components/Editor/ui/HistoryButton";
import { AlignItem } from "@/components/Editor/ui/AlignItem/AlignItem";
import { ListButton } from "@/components/Editor/ui/ListButton";

export const Toolbar = () => {
    return (
        <Space.Compact>
            <HistoryButton historyType={"undo"} />
            <HistoryButton historyType={"redo"} />
            <BlockTypeButton />
            <AlignItem />
            <ListButton
                tooltipText={"Ненумерованный список"}
                nodeType={"ul"}
                icon={<UnorderedListOutlined />}
            />
            <ListButton
                tooltipText={"Нумерованный список"}
                nodeType={"ol"}
                icon={<OrderedListOutlined />}
            />
            <TextStyleButton
                tooltipText={"Полужирный"}
                icon={<BoldOutlined />}
                nodeType={"bold"}
            />
            <TextStyleButton
                tooltipText={"Полужирный"}
                icon={<ItalicOutlined />}
                nodeType={"italic"}
            />
            <TextStyleButton
                tooltipText={"Подчеркнутый"}
                icon={<UnderlineOutlined />}
                nodeType={"underline"}
            />
        </Space.Compact>
    );
};
