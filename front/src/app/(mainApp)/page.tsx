"use client";

import s from "./page.module.scss";
import { HomeHero } from "@/components/HomeHero";
import { HomeSection } from "@/components/HomeSection";
import { TournamentFormatsSection } from "@/components/TournamentFormatsSection";
import { FeaturedTournaments } from "@/components/FeaturedTournaments";
import { ChoiceSideSection } from "@/components/ChoiceSideSection";
import { SupportCard } from "@/components/SupportCard";
import { PopularSpaces } from "@/components/PopularSpaces";

export default function Home() {
    return (
        <>
            <HomeHero />
            <HomeSection
                title="Актуальные турниры"
                actionHref="/tournaments"
                actionLabel="Смотреть все"
            >
                <FeaturedTournaments />
            </HomeSection>
            <HomeSection
                title="Популярные пространства"
                actionHref="/s"
                actionLabel="Показать больше"
            >
                <PopularSpaces />
            </HomeSection>
            <TournamentFormatsSection title="Форматы турнирной сетки" />
            <HomeSection title="Выбор на вашей стороне" className={s.gap140}>
                <ChoiceSideSection />
            </HomeSection>

            <div className={s.gap140} style={{ padding: "0 var(--cuply-layout-pad-inline)" }}>
                <div style={{ maxWidth: "var(--cuply-header-footer-inner-max)", margin: "0 auto" }}>
                    <SupportCard />
                </div>
            </div>
        </>
    );
}
