import { useGetTournamentsQuery } from "@/services/Tournament/tournament";
import { TODAY } from "@/shared/lib/dayjs";
import { sliderSettings } from "@/components/FeaturedTournaments/sliderSettings";
import { Carousel, Col, Empty, Row, Skeleton, Typography } from "antd";
import { TournamentMiniCard } from "@/components/TournamentMiniCard";
import SkeletonInput from "antd/es/skeleton/Input";
import Link from "next/link";
import s from "./style.module.scss";
import { useRef } from "react";
import type { CarouselRef } from "antd/es/carousel";
import { clsx } from "clsx";

export const FeaturedTournaments = () => {
    const carouselRef = useRef<CarouselRef>(null);
    const wheelLockRef = useRef(false);

    const { currentData: tournaments, isLoading } = useGetTournamentsQuery({
        page: 1,
        per_page: 10,
        //tournament_end__gte: TODAY,
        lifecycle_status__in: [1, 2, 3, 4, 7, 8],
        show_recommended: true,
    });

    const activeTournaments = tournaments?.payload?.slice(0, 10);
    // Mock: увеличиваем количество элементов в 3 раза (повторяем список)
    const mockedTournaments = activeTournaments
        ? [...activeTournaments, ...activeTournaments, ...activeTournaments]
        : [];
    const limitSlides = mockedTournaments.length > 0 && mockedTournaments.length < 3;

    return (
        <>
            {isLoading && (
                <div className={s.wrapper}>
                    <div className={s.skeletonRow}>
                        <Row gutter={16}>
                            <Col xs={24} sm={12}>
                                <Skeleton />
                            </Col>
                            <Col xs={24} sm={12}>
                                <Skeleton />
                            </Col>
                        </Row>
                    </div>
                </div>
            )}
            {mockedTournaments.length > 0 && (
                <div className={s.wrapper}>
                    <div className={clsx(s.bleed, limitSlides && s.limitSlides)}>
                        <div>
                            <Carousel ref={carouselRef} {...sliderSettings}>
                                {mockedTournaments.map((item, index) => (
                                    <TournamentMiniCard
                                        tournament={item}
                                        key={`${item.id}-${index}`}
                                    />
                                ))}
                            </Carousel>
                        </div>
                    </div>
                </div>
            )}
            {activeTournaments?.length === 0 && (
                <div className={s.wrapper}>
                    <Empty
                        imageStyle={{ height: "fit-content" }}
                        image={<Typography.Title>🍃</Typography.Title>}
                        description={
                            "                        Активных рейтинговых турниров пока что нет\n"
                        }
                    >
                        Но если вам хочется посоревноваться, можно найти
                        пользовательские в нашем{" "}
                        <Link href={"/tournaments"}>каталоге</Link>
                    </Empty>
                </div>
            )}
        </>
    );
};
