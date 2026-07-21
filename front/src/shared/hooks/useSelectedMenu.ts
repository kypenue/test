import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { MenuProps } from "antd";

export const useSelectedMenu = (menuItems: MenuProps["items"]) => {
    const params = usePathname();

    return useMemo(() => {
        return (menuItems
            ?.reverse()
            ?.find(
                (item) =>
                    item &&
                    "key" in item &&
                    item["key"] &&
                    params.includes(item.key as string),
            )?.key ?? "") as string;
    }, [params, menuItems]);
};
