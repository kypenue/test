import { Button, type ButtonProps, Tooltip, type TooltipProps } from "antd";
import {
    useListToolbarButton,
    useListToolbarButtonState,
} from "@platejs/list-classic/react";

interface ListButtonProps extends ButtonProps {
    nodeType: "ol" | "ul";
    tooltipText?: TooltipProps["title"];
}

export const ListButton = ({
    tooltipText,
    nodeType,
    ...props
}: ListButtonProps) => {
    const state = useListToolbarButtonState({ nodeType });
    const { props: buttonProps } = useListToolbarButton(state);

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
