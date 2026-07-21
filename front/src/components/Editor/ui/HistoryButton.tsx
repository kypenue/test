import { useEditorRef, useEditorSelector } from "@platejs/core/react";
import { Button, ButtonProps, Tooltip, TooltipProps } from "antd";
import { RedoOutlined, UndoOutlined } from "@ant-design/icons";

interface HistoryButtonProps extends ButtonProps {
    historyType: "undo" | "redo";
    tooltipText?: TooltipProps["title"];
}

export const HistoryButton = ({
    tooltipText,
    historyType,
}: HistoryButtonProps) => {
    const editor = useEditorRef();
    const disabled = useEditorSelector(
        (editor) => editor.history[`${historyType}s`].length === 0,
        [],
    );

    const onClick = () => {
        editor[historyType]?.();
    };

    return (
        <Tooltip title={tooltipText}>
            <Button
                disabled={disabled}
                onClick={onClick}
                icon={
                    historyType === "undo" ? <UndoOutlined /> : <RedoOutlined />
                }
            />
        </Tooltip>
    );
};
