import { usePlateEditor } from "@platejs/core/react";
import { AlignKit } from "@/components/Editor/plugins/AlignKit";
import {
    BoldPlugin,
    H1Plugin,
    H2Plugin,
    H3Plugin,
    ItalicPlugin,
    UnderlinePlugin,
} from "@platejs/basic-nodes/react";
import { H1Element } from "@/components/Editor/headings/H1Element";
import { H2Element } from "@/components/Editor/headings/H2Element";
import { H3Element } from "@/components/Editor/headings/H3Element";
import { ListKit } from "@/components/Editor/plugins/ListKit";
import { DocxKit } from "@/components/Editor/plugins/DocxKit";

export const useSetEditor = (value: string) => {
    return usePlateEditor({
        override: {
            enabled: {
                indent: false,
                list: false,
            },
        },
        plugins: [
            ...AlignKit,
            ...ListKit,
            ...DocxKit,
            BoldPlugin,
            ItalicPlugin,
            UnderlinePlugin,
            H1Plugin.withComponent(H1Element),
            H2Plugin.withComponent(H2Element),
            H3Plugin.withComponent(H3Element),
        ],
        value: JSON.parse(value),
        options: {
            offset: 10,
            padding: 10,
        },
    });
};
