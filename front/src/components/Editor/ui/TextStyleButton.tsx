import { Button, type ButtonProps, Tooltip, type TooltipProps } from "antd";
import {
    useMarkToolbarButton,
    useMarkToolbarButtonState,
} from "@platejs/utils/react";

interface ToolbarButtonProps extends ButtonProps {
    nodeType: string;
    tooltipText?: TooltipProps["title"];
}

export const TextStyleButton = ({
    tooltipText,
    nodeType,
    ...props
}: ToolbarButtonProps) => {
    const state = useMarkToolbarButtonState({ nodeType });
    const { props: buttonProps } = useMarkToolbarButton(state);

    return (
        <Tooltip title={tooltipText}>
            <Button
                {...props}
                type={state.pressed ? "primary" : "default"}
                {...buttonProps}
            />
        </Tooltip>
    );
};
