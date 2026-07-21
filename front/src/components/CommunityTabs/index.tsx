import { Tabs } from "antd";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export interface CommunityTabsProps {
    slug: string;
}

const tabs = [
    {
        key: "",
        label: "Главная",
    },
    {
        key: "about",
        label: "О нас",
        disabled: true,
    },
    {
        key: "tournaments",
        label: "Турниры",
        disabled: true,
    },
];

export const CommunityTabs = ({ slug }: CommunityTabsProps) => {
    const pathname = usePathname();
    const router = useRouter();

    const [activeKey, setActiveKey] = useState("");

    const handleChange = (key: string) => {
        setActiveKey(key);
        router.replace(`/s/${slug}/${key}`);
    };

    useEffect(() => {
        const regexp = new RegExp(`\/${slug}\\/([^\\/?#]+)`);
        const key = pathname.match(regexp);
        if (key) {
            setActiveKey(key[1]);
        }
    }, []);
    return <Tabs onChange={handleChange} items={tabs} activeKey={activeKey} />;
};
