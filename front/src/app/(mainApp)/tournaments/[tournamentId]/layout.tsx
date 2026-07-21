"use client";
import { Layout } from "antd";
import React from "react";

const TournamentLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return <Layout>{children}</Layout>;
};

export default TournamentLayout;
