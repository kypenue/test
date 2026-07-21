import { Plate, PlateContent } from "@platejs/core/react";
import { useSetEditor } from "@/components/Editor/hooks/useSetEditor";

import s from "@/components/Editor/Editor.module.css";

interface ReadOnlyEditorProps {
    value: string;
}

export const ReadOnlyEditor = ({ value }: ReadOnlyEditorProps) => {
    const editor = useSetEditor(value);

    return (
        <Plate editor={editor} readOnly>
            <PlateContent
                style={{ minHeight: "100px" }}
                className={s.content}
            />
        </Plate>
    );
};
