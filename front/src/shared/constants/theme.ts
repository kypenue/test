import { theme, ThemeConfig } from "antd";

export const THEME_CONFIG: ThemeConfig = {
    algorithm: theme.darkAlgorithm,
    token: {
        colorBgContainer: "#1C173A",
        borderRadius: 8,
        colorBgBase: "#090019",
        colorPrimary: "#6122E0",
        colorBgElevated: "#1C173A",
    },
    components: {
        Drawer: {
            colorBgBase: "#1C173A",
            colorFillContent: "#1C173A",
            colorBgElevated: "#1C173A",
        },
        Tabs: {
            itemActiveColor: "#B9BEEC",
            inkBarColor: "#B9BEEC",
            itemColor: "rgba(185,190,236,0.6)",
            itemSelectedColor: "#B9BEEC",
            itemHoverColor: "#9ea2cb",
        },
        Menu: {
            itemSelectedColor: "rgba(255,255,255,1)",
            darkItemSelectedBg: "rgba(255,255,255,0.15)",
            darkItemBg: "#0E0029",
        },
        Layout: {
            siderBg: "#0E0029",
            headerBg: "#091433",
        },
        Divider: {
            colorSplit: "#423756",
        },
        Input: {
            colorBgContainer: "#0E0029",
        },
        DatePicker: {
            colorBgContainer: "#070014",
        },
        Checkbox: {
            colorBgContainer: "#070014",
        },
        Table: {
            borderColor: "#6122E04D",
            headerBg: "#22195A",
            headerBorderRadius: 8,
            headerColor: "#B9BEEC",
            headerSplitColor: "#22195A",
            bodySortBg: "#0E0029",
            cellFontSize: 17,
            cellPaddingBlock: 16,
        },
        Button: {
            defaultBorderColor: "#6122E0",
        },
        Select: {
            selectorBg: "#0E0029",
        },
        Modal: {
            colorBgMask: "rgba(0, 0, 0, 0.85)",
        },
        Radio: {
            buttonSolidCheckedHoverBg: "0px 0px 10px rgba(255,255,255,0.1)",
        },
        List: {
            colorSplit: "#423756",
        },
    },
};
