import { FloatButton, Tooltip } from "antd";
import { InfoCircleOutlined, SettingOutlined } from "@ant-design/icons";
import { FaTelegramPlane } from "react-icons/fa";
import useBreakpoint from "antd/es/grid/hooks/useBreakpoint";
import { useState } from "react";

export const TelegramButton = () => {
    const { xs } = useBreakpoint();
    const [isOpenMenu, setIsOpenMenu] = useState(false);

    const handleOnOpenChange = (value: boolean) => {
        if (value) {
            setTimeout(() => setIsOpenMenu(value), 300);
        } else {
            setIsOpenMenu(value);
        }
    };

    return (
        <FloatButton.Group
            trigger={xs ? "click" : "hover"}
            type="primary"
            style={{ insetInlineEnd: 24 }}
            icon={<FaTelegramPlane />}
            onOpenChange={handleOnOpenChange}
        >
            <Tooltip open={isOpenMenu} placement="left" title="Новости CUPLY">
                <FloatButton
                    icon={<InfoCircleOutlined />}
                    type="primary"
                    href="https://t.me/cuplypro"
                />
            </Tooltip>
            <Tooltip
                open={isOpenMenu}
                placement="left"
                title="Техническая подержка"
            >
                <FloatButton
                    type="primary"
                    style={{ insetInlineEnd: 164 }}
                    href="https://t.me/cuply_support_bot"
                    icon={<SettingOutlined />}
                />{" "}
            </Tooltip>
        </FloatButton.Group>
    );
};

export { FooterTelegramMenu } from "./FooterTelegramMenu";