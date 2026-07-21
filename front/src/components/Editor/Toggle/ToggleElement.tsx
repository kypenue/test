import { PlateElement } from "@platejs/core/react";
import type { PlateElementProps } from "platejs/react";
import { Button } from "antd";
import { useToggleButton, useToggleButtonState } from "@platejs/toggle/react";
import { DownOutlined, UpOutlined } from "@ant-design/icons";

export const ToggleElement = (props: PlateElementProps) => {
    const element = props.element;
    const state = useToggleButtonState(element.id as string);
    const { buttonProps, open } = useToggleButton(state);
    return (
        <PlateElement {...props} className="pl-6">
            <Button
                contentEditable={false}
                {...buttonProps}
                type="text"
                size="small"
                icon={
                    open ? <UpOutlined size={10} /> : <DownOutlined size={10} />
                }
            />
            {props.children}
        </PlateElement>
    );
};
