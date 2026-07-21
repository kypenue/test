import { Dropdown, type MenuProps } from "antd";
import { useEditorRef } from "@platejs/core/react";
import { useSelectionFragmentProp } from "@platejs/utils/react";
import { KEYS, type TElement } from "platejs";
import { useCallback, useMemo } from "react";
import type { MenuInfo } from "rc-menu/lib/interface";

import s from "./BlockTypeButton.module.scss";

const ITEMS = [
    {
        key: KEYS.p,
        label: "Текст",
        title: "Текст",
    },
    {
        key: KEYS.h1,
        label: "Заголовок 1",
        title: "Заголовок 1",
    },
    {
        key: KEYS.h2,
        label: "Заголовок 2",
        title: "Заголовок 2",
    },
    {
        key: KEYS.h3,
        label: "Заголовок 3",
        title: "Заголовок 3",
    },
    // {
    //     key: KEYS.toggle,
    //     label: "Аккардеон",
    //     title: "Аккардеон",
    // },
] satisfies MenuProps["items"];

const getBlockType = (block: TElement) => {
    if (block[KEYS.listType]) {
        if (block[KEYS.listType] === KEYS.ol) {
            return KEYS.ol;
        } else if (block[KEYS.listType] === KEYS.listTodo) {
            return KEYS.listTodo;
        } else {
            return KEYS.ul;
        }
    }
    return block.type;
};

export const BlockTypeButton = () => {
    const editor = useEditorRef();

    const value = useSelectionFragmentProp({
        defaultValue: KEYS.p,
        getProp: (node) => getBlockType(node as TElement),
    });

    const selectedItem = useMemo(
        () => ITEMS.find((item) => item?.key === (value ?? KEYS.p)) ?? ITEMS[0],
        [value],
    );

    const onClick = useCallback((e: MenuInfo) => {
        editor.tf.toggleBlock(e.key);
    }, []);

    return (
        <Dropdown.Button
            menu={{ items: ITEMS, onClick }}
            rootClassName={s.button}
        >
            {selectedItem?.title}
        </Dropdown.Button>
    );
};
