"use client";
import { Layout } from "antd";
import React from "react";
import { ContentCard } from "@/components/ContentCard";

const TournamentCreationLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <Layout>
            <ContentCard title={"Создание турнира"}>{children}</ContentCard>
        </Layout>
    );
};

export default TournamentCreationLayout;
