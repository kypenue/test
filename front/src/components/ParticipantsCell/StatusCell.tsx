import { Tag } from "antd";
import {
    COLOR_REG_STATUS,
    EMOJI_REG_STATUS,
    STATUS_REG_TEXT,
} from "@/shared/lib/statusMapper";

interface StatusCellProps {
    status: 1 | 2 | 3 | 4;
}

export const StatusCell = ({ status }: StatusCellProps) => {
    return (
        <Tag
            color={COLOR_REG_STATUS[status]}
            icon={EMOJI_REG_STATUS[status]}
        >
            {STATUS_REG_TEXT[status]}
        </Tag>
    );
};