"use client";
import { IdcardOutlined, LoginOutlined } from "@ant-design/icons";
import { Tabs } from "antd";
import { LoginForm } from "@/components/LoginForm";
import { ProfileForm } from "@/components/ProfileForm";
import { useState } from "react";

const tabs = [
    {
        key: "auth",
        label: `Вход`,
        children: <LoginForm />,
        icon: <LoginOutlined />,
    },
    {
        key: "reg",
        label: `Регистрация`,
        children: <ProfileForm />,
        icon: <IdcardOutlined />,
    },
];

const AuthPage = () => {
    const [activeTab, setActiveTab] = useState(tabs[0].key);
    return (
        <div>
            <Tabs
                defaultActiveKey="auth"
                items={tabs}
                activeKey={activeTab}
                onChange={setActiveTab}
            />
        </div>
    );
};

export default AuthPage;