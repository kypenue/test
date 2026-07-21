import { isArray, isObject } from "lodash";
import type { DefaultOptionType } from "antd/es/select";

interface BaseEntity {
    id: number;
    name: string;
}

export const isBaseEntity = (object: unknown): object is BaseEntity =>
    isObject(object) && "id" in object && "name" in object;

export const selectEntityAdapter = <T extends DefaultOptionType | BaseEntity>(
    array: Array<T>,
): Array<DefaultOptionType> => {
    if (
        isArray(array) &&
        !!array.length &&
        array[0] &&
        isBaseEntity(array[0])
    ) {
        return array.map((el) => ({
            label: el.name,
            value: el.id,
        }));
    }
    return array as Array<DefaultOptionType>;
};
