import { TabsProps } from "antd";
import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createQueryString } from "@/shared/lib/createQueryString";

export const useRoutedTabs = ({
    tabs,
    searchParamName,
    fallbackTab,
}: {
    tabs: TabsProps["items"];
    searchParamName: string;
    fallbackTab: string;
}) => {
    const router = useRouter();
    const pathname = usePathname();
    const param = useSearchParams();

    const activeKey = useMemo(() => {
        if (param.get(searchParamName) && tabs) {
            return (
                tabs.find(({ key }) => param.get(searchParamName) === key)
                    ?.key ||
                fallbackTab ||
                tabs[0].key
            );
        }
        return tabs ? tabs[0].key : fallbackTab;
    }, [param, tabs]);

    const handleTabChange = (key: string) => {
        const qs = createQueryString(searchParamName, key, param);
        router.push(pathname + "?" + qs);
    };

    return { activeKey, handleTabChange };
};
