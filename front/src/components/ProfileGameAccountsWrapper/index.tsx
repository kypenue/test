import { Card, Col, Empty, Flex, Row, Typography } from "antd";
import Link from "next/link";
import { useIsCurrentUser } from "@/shared/hooks/useIsCurrentUser";
import { useParams } from "next/navigation";
import { PlatformIcon } from "@/components/PlatformIcon";
import { useGetProfileGames } from "@/shared/hooks/useGetProfileGames";
import { ContentCard } from "@/components/ContentCard";
import { ProfileGameAccounts } from "@/components/ProfileGameAccountsWrapper/ProfileGameAccounts";

export const ProfileGamesWrapper = () => {
    const params = useParams<{ userId: string }>();

    const { gamesData, isLoading } = useGetProfileGames();

    return (
        <ContentCard>
            <Row align={"middle"} gutter={[24, 24]}>
                <Col span={24}>
                    <ProfileGameAccounts
                        userId={params.userId}
                        isLoading={isLoading}
                        data={gamesData}
                    />
                </Col>
            </Row>
        </ContentCard>
    );
};
