import { useEditorPlugin } from "@platejs/core/react";
import { TextAlignPlugin } from "@platejs/basic-styles/react";
import type { Alignment } from "@platejs/basic-styles";
import { useSelectionFragmentProp } from "@platejs/utils/react";
import { useCallback } from "react";
import {
    AlignCenterOutlined,
    AlignLeftOutlined,
    AlignRightOutlined,
} from "@ant-design/icons";
import { BiAlignJustify } from "react-icons/bi";
import { Dropdown } from "antd";
import type { MenuInfo } from "rc-menu/lib/interface";

import s from "./AlignItem.module.scss";

const ITEMS = [
    {
        label: <AlignLeftOutlined size={16} />,
        value: "left",
        key: "left",
    },
    {
        label: <AlignCenterOutlined size={16} />,
        value: "center",
        key: "center",
    },
    {
        label: <AlignRightOutlined size={16} />,
        value: "right",
        key: "right",
    },
    {
        label: <BiAlignJustify size={16} />,
        value: "justify",
        key: "justify",
    },
];

export const AlignItem = () => {
    const { editor, tf } = useEditorPlugin(TextAlignPlugin);
    const value =
        useSelectionFragmentProp({
            defaultValue: "start",
            getProp: (node) => node.align,
        }) ?? "left";

    const IconValue = ITEMS.find((item) => item.value === value)?.label ?? (
        <AlignLeftOutlined />
    );

    const onClick = useCallback((e: MenuInfo) => {
        tf.textAlign.setNodes(e.key as Alignment);
        editor.tf.focus();
    }, []);

    return (
        <Dropdown.Button
            menu={{ items: ITEMS, onClick }}
            rootClassName={s.menu}
        >
            {IconValue}
        </Dropdown.Button>
    );
};
