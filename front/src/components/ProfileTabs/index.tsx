import { Col, Row, Tabs, TabsProps } from "antd";
import { ProfileInformation } from "@/components/ProfileInformation";
import { ProfileGamesWrapper } from "../ProfileGameAccountsWrapper";
import { ProfileSeries } from "@/components/ProfileSeries";
import { ProfileStats } from "@/components/ProfileStats";
import { TournamentStats } from "@/components/TournamentStats";
import { useRoutedTabs } from "@/shared/hooks/useRoutedTabs";

const items: TabsProps["items"] = [
    {
        key: "info",
        label: "Информация",
        children: <ProfileInformation />,
    },
    {
        key: "game_accounts",
        label: "Игровые аккаунты",
        children: <ProfileGamesWrapper />,
    },
    {
        key: "series",
        label: "Серии",
        children: <ProfileSeries />,
    },
    {
        key: "tournament_results",
        label: "Результаты турниров",
        children: <TournamentStats />,
    },
    {
        key: "stats",
        label: "Статистика",
        children: <ProfileStats />,
    },
];

export const ProfileTabs = () => {
    const { activeKey, handleTabChange } = useRoutedTabs({
        tabs: items,
        fallbackTab: items[0].key,
        searchParamName: "account_tab",
    });
    return (
        <Row>
            <Col span={24}>
                <Tabs
                    defaultActiveKey="1"
                    items={items}
                    activeKey={activeKey}
                    onChange={handleTabChange}
                />
            </Col>
        </Row>
    );
};
