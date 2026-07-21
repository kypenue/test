import { Avatar } from "@/components/Avatar";
import { Flex, Typography } from "antd";
import { useGetCommunityByIdQuery } from "@/services/Communities/community";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useIsSpaceOwner } from "@/shared/hooks/useIsSpaceOwner";

export interface CommunityHeaderProps {
    avatar: string;
}

export const CommunityHeader = ({ avatar }: CommunityHeaderProps) => {
    const { slug } = useParams<{ slug: string }>();
    const { currentData } = useGetCommunityByIdQuery({ communityId: slug });

    const { isOwner } = useIsSpaceOwner(slug);

    return (
        <div>
            <Flex align={"center"} gap={16}>
                <Avatar url={avatar} />
                <div>
                    <Typography.Title style={{ lineHeight: 0.5 }}>
                        {currentData?.title}
                    </Typography.Title>
                    {isOwner && (
                        <Link href={`/s/settings/${slug}/`}>
                            Настройка пространства
                        </Link>
                    )}
                </div>
            </Flex>
        </div>
    );
};
