"use client";
import { Layout } from "antd";
import React from "react";
import useBreakpoint from "antd/es/grid/hooks/useBreakpoint";
import {
    useGetCommunitiesQuery,
    useGetCommunityByIdQuery,
} from "@/services/Communities/community";
import s from "./style.module.scss";
import { CommunityHeader } from "@/components/CommunityHeader";
import { CommunityTabs } from "@/components/CommunityTabs";
import { getStaticImage } from "@/shared/lib/getStaticImage";

const { Content } = Layout;

export type CommunityLayoutProps = Readonly<{
    children: React.ReactNode;
    params: { slug: string };
}>;

const CommunityLayout = ({
    children,
    params: { slug },
}: CommunityLayoutProps) => {
    const {} = useGetCommunitiesQuery({});
    const { currentData } = useGetCommunityByIdQuery({ communityId: slug });
    const breakpoints = useBreakpoint();

    return (
        <Layout className={s.coverPage}>
            {currentData && (
                <>
                    <div
                        className={s.cover}
                        style={{
                            backgroundImage: `url("${getStaticImage(currentData?.header?.object_key)}")`,
                        }}
                    ></div>
                    <Content
                        style={{
                            margin: breakpoints.xs ? "8px 8px" : "24px 16px",
                            padding: breakpoints.xs ? 8 : 24,
                            minHeight: 280,
                        }}
                    >
                        <div className={s.wrapper}>
                            <CommunityHeader
                                avatar={getStaticImage(
                                    currentData?.avatar?.object_key,
                                )}
                            />
                            <CommunityTabs slug={slug} />
                            {children}
                        </div>
                    </Content>
                </>
            )}
        </Layout>
    );
};

export default CommunityLayout;
