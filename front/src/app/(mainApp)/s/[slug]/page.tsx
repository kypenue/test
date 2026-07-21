"use client";

import { AuthorCard } from "@/components/AuthorCard";
import { useGetCommunityByIdQuery } from "@/services/Communities/community";
import { useGetTournamentsQuery } from "@/services/Tournament/tournament";
import { TournamentCard } from "@/components/TournamentCard";
import { Carousel, Col, Row } from "antd";
import useBreakpoint from "antd/es/grid/hooks/useBreakpoint";
import { sliderSettings } from "@/components/FeaturedTournaments/sliderSettings";
import { TournamentMiniCard } from "@/components/TournamentMiniCard";

export interface CommunityPageProps {
    params: {
        slug: string;
    };
}

const CommunityPage = ({ params: { slug } }: CommunityPageProps) => {
    const { md } = useBreakpoint();
    const { currentData: community } = useGetCommunityByIdQuery({
        communityId: slug,
    });
    const { currentData: tournaments } = useGetTournamentsQuery(
        {
            community_id: community?.id,
        },
        { skip: !community?.id },
    );

    const tournamentsList = tournaments?.payload
        ? md
            ? tournaments?.payload.slice(1)
            : tournaments?.payload
        : undefined;

    return (
        <>
            {community && tournaments && tournamentsList && (
                <>
                    <Row wrap={true} gutter={[16, 16]}>
                        <Col order={md ? 2 : 1} xs={24} md={8}>
                            <AuthorCard
                                title={`${community.creator.surname} ${community.creator.name}`}
                                description={"Автор пространства"}
                            />
                        </Col>
                        {md &&
                            Array.isArray(tournaments.payload) &&
                            tournaments?.payload.length > 0 &&
                            tournaments.payload[0] &&
                            "id" in tournaments.payload[0] && (
                                <Col order={1} xs={24} md={16}>
                                    <TournamentCard
                                        tournament={tournaments.payload[0]}
                                    />
                                </Col>
                            )}

                        <Col xs={24}>
                            <Carousel {...sliderSettings}>
                                {tournamentsList?.map((item) => (
                                    <TournamentMiniCard
                                        tournament={item}
                                        key={item.id}
                                    />
                                ))}
                            </Carousel>
                        </Col>
                    </Row>
                </>
            )}
        </>
    );
};

export default CommunityPage;
