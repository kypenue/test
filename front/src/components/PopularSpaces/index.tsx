"use client";

import { useMemo, useRef } from "react";
import type { CarouselRef } from "antd/es/carousel";
import { Carousel } from "antd";
import { useGetCommunitiesQuery } from "@/services/Communities/community";
import { sliderSettings } from "@/components/FeaturedTournaments/sliderSettings";
import { SpaceMiniCard } from "@/components/SpaceMiniCard";
import { clsx } from "clsx";
import s from "./style.module.scss";

export const PopularSpaces = () => {
    const carouselRef = useRef<CarouselRef>(null);

    const { currentData } = useGetCommunitiesQuery({
        page: 1,
        per_page: 10,
    });

    const spaces = currentData?.payload ?? [];
    const limitSlides = spaces.length > 0 && spaces.length < 3;

    const carouselSettings = useMemo(() => {
        const count = spaces.length;

        const baseShow = count <= 3 ? Math.max(count, 1) : 3.2;
        const tabletShow = count <= 2 ? Math.max(count, 1) : 2.15;
        const mobileShow = count <= 1 ? 1 : 1.12;

        return {
            ...sliderSettings,
            slidesToShow: baseShow,
            slidesToScroll: 1,
            responsive: [
                {
                    breakpoint: 1440,
                    settings: {
                        ...(sliderSettings.responsive?.[0]?.settings ?? {}),
                        slidesToShow: baseShow,
                        slidesToScroll: 1,
                        infinite: false,
                    },
                },
                {
                    breakpoint: 680,
                    settings: {
                        ...(sliderSettings.responsive?.[1]?.settings ?? {}),
                        slidesToShow: tabletShow,
                        slidesToScroll: 1,
                        initialSlide: 0,
                    },
                },
                {
                    breakpoint: 480,
                    settings: {
                        ...(sliderSettings.responsive?.[2]?.settings ?? {}),
                        slidesToShow: mobileShow,
                        slidesToScroll: 1,
                    },
                },
            ],
        };
    }, [spaces.length]);

    return (
        <div className={s.wrapper}>
            {spaces.length > 0 && (
                <div className={clsx(s.bleed, limitSlides && s.limitSlides)}>
                    <div>
                        <Carousel ref={carouselRef} {...carouselSettings}>
                            {spaces.map((space) => (
                                <SpaceMiniCard key={space.id} space={space} />
                            ))}
                        </Carousel>
                    </div>
                </div>
            )}
        </div>
    );
};

