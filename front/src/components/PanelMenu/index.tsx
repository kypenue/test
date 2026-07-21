"use client";
import { Avatar, Button, Col, Divider, Layout, Menu, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useSelectedMenu } from "@/shared/hooks/useSelectedMenu";
import { useGetCurrentUserQuery } from "@/services/User/user";
import { userMock } from "@/shared/constants/userMock";
import s from "./style.module.scss";
import useBreakpoint from "antd/es/grid/hooks/useBreakpoint";
import { profileMenuItemsUtil } from "@/components/HeaderMenu";

const PanelMenu = () => {
    const [menuItems, setMenuItems] = useState(profileMenuItemsUtil);
    const { currentData: user } = useGetCurrentUserQuery();
    const selectedMenu = useSelectedMenu(menuItems);
    const breakpoint = useBreakpoint();

    useEffect(() => {
        if (profileMenuItemsUtil) {
            setMenuItems([...profileMenuItemsUtil]);
        }
    }, [user]);

    return !breakpoint.xs ? (
        <Layout.Sider collapsedWidth={0} width={220} className={s.sider}>
            <div
                style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                }}
            >
                <div>
                    <div className="demo-logo-vertical" />
                    <Row
                        style={{ marginLeft: 8, marginTop: 24 }}
                        align={"middle"}
                        gutter={8}
                    >
                        <Col>
                            <Avatar
                                shape="square"
                                size="large"
                                icon={<img src={userMock.avatar} />}
                            />
                        </Col>
                        <Col>
                            <strong>{user?.username}</strong>
                        </Col>
                    </Row>
                    <Divider />
                    <Menu
                        theme="dark"
                        mode="inline"
                        selectedKeys={[selectedMenu]}
                        items={menuItems}
                    />
                </div>
                <div style={{ padding: 12 }}>
                    <Button block>Выйти из аккаунта</Button>
                </div>
            </div>
        </Layout.Sider>
    ) : (
        <></>
    );
};

export default PanelMenu;
