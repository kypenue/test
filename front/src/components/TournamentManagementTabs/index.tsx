import { Col, Row, Tabs, TabsProps } from "antd";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const items: TabsProps["items"] = [
    {
        key: "participants",
        label: "Участники",
    },
    // {
    //     key: "playing",
    //     label: "Жеребьевка",
    // },
    {
        key: "complains",
        label: "Жалобы",
    },
    {
        key: "moderators",
        label: "Модераторы",
    },
    // {
    //     key: "rounds",
    //     label: "Раунды",
    // },
];

export const TournamentManagementTabs = ({ id }: { id: string }) => {
    const router = useRouter();
    const pathname = usePathname();
    const [activeKey, setActiveKey] = useState("participants");

    const handleChange = (key: string) => {
        setActiveKey(key);
        router.replace(`/panel/tournaments/${id}/manage/${key}`);
    };

    useEffect(() => {
        const key = pathname.match(/\/manage\/([^\/?#]+)/);
        if (key) {
            setActiveKey(key[1]);
        }
    }, []);

    return (
        <Row>
            <Col span={24}>
                <Tabs
                    defaultActiveKey={activeKey}
                    items={items}
                    activeKey={activeKey}
                    defaultValue={activeKey}
                    onChange={handleChange}
                />
            </Col>
        </Row>
    );
};
