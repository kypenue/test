import { MenuProps } from "antd";
import Link from "next/link";
import { NavigateOptions } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { profileMenuItemsUtil } from "@/components/HeaderMenu/index";
import { ApartmentOutlined } from "@ant-design/icons";
import React from "react";

export const getHeaderProfileMenu = (
    refresh: (adr: string, options?: NavigateOptions) => void,
    removeToken: () => void,
    userRole: number,
): MenuProps["items"] => {
    const logout = () => {
        removeToken();
        refresh("/auth");
    };

    return [
        {
            key: "/account",
            label: <Link href="/account/current">Аккаунт</Link>,
        },
        {
            key: "/panel",
            label: "Панель управления",
            children: profileMenuItemsUtil!,
        },
        { type: "divider" },
        {
            key: "/logout",
            onClick: logout,
            label: "Выход",
        },
    ];
};
