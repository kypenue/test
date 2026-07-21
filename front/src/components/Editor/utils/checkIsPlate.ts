type PlateTextNode = { text: string; [key: string]: any };
type PlateElementNode = {
    type: string;
    children: PlateNode[];
    [key: string]: any;
};
type PlateNode = PlateTextNode | PlateElementNode;
type PlateValue = PlateNode[];

export type Parsed =
    | { kind: "plate"; value: PlateValue }
    | { kind: "markdown"; value: string }
    | { kind: "json-other"; value: unknown }; // если вдруг прилетит не Plate, но валидный JSON

function isObject(v: unknown): v is Record<string, any> {
    return v !== null && typeof v === "object";
}

function isTextNode(n: unknown): n is PlateTextNode {
    return isObject(n) && typeof n.text === "string";
}

function isElementNode(n: unknown): n is PlateElementNode {
    return (
        isObject(n) &&
        typeof n.type === "string" &&
        Array.isArray((n as any).children) &&
        (n as any).children.every(isNode)
    );
}

function isNode(n: unknown): n is PlateNode {
    return isTextNode(n) || isElementNode(n);
}

function isPlateValue(v: unknown): v is PlateValue {
    return Array.isArray(v) && v.every(isNode);
}

function tryParseJson(s: string): { ok: true; value: unknown } | { ok: false } {
    try {
        return { ok: true, value: JSON.parse(s) };
    } catch {
        return { ok: false };
    }
}

/**
 * Главная функция: получает строку из бэка и решает, что внутри.
 */
export function parseBackendString(input: string): Parsed {
    const trimmed = input.trim();

    // Эвристика: JSON обычно начинается с { или [
    if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
        const parsed = tryParseJson(trimmed);
        if (parsed.ok) {
            if (isPlateValue(parsed.value)) {
                return { kind: "plate", value: parsed.value };
            }
            return { kind: "json-other", value: parsed.value };
        }
    }

    return { kind: "markdown", value: input };
}
