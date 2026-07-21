import { Plate, PlateContent } from "@platejs/core/react";

import { Toolbar } from "@/components/Editor/Toolbar";
import { useController, useFormContext } from "react-hook-form";
import { useSetEditor } from "@/components/Editor/hooks/useSetEditor";

import s from "./Editor.module.css";
import { clsx } from "clsx";

interface EditorProps {
    fieldName: string;
    placeholder?: string;
}

export const Editor = ({ fieldName, placeholder }: EditorProps) => {
    const { control } = useFormContext();

    const {
        field: { onChange, value },
    } = useController({
        name: fieldName,
        control,
    });

    const editor = useSetEditor(value);

    return (
        <Plate
            editor={editor}
            onChange={({ value }) => {
                onChange(JSON.stringify(value));
            }}
        >
            <Toolbar />
            <PlateContent
                style={{ minHeight: "100px" }}
                placeholder={placeholder}
                name={fieldName}
                id={fieldName}
                className={clsx(s.content, s.text)}
            />
        </Plate>
    );
};
