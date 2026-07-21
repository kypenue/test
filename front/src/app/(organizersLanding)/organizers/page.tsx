// This enables Static Site Generation
import Header from "@/components/OrganizersLanding/Header";
import Hero from "@/components/OrganizersLanding/Hero";
import About from "@/components/OrganizersLanding/About";
import Features from "@/components/OrganizersLanding/Features";
import TournamentStages from "@/components/OrganizersLanding/TournamentStages";
import Pricing from "@/components/OrganizersLanding/Pricing";
import FAQ from "@/components/OrganizersLanding/FAQ";
import CTA from "@/components/OrganizersLanding/CTA";
import Contact from "@/components/OrganizersLanding/Contact";
import Footer from "@/components/OrganizersLanding/Footer";
import SuccessStories from "@/components/OrganizersLanding/SuccessStories";
import SupportedGames from "@/components/OrganizersLanding/SupportedGames";

export const dynamic = "force-static";
export const revalidate = false;

export default function Home() {
    return (
        <main className="site-body">
            <Header />
            <Hero />
            <About />
            <Features />
            <SuccessStories />
            <TournamentStages />
            <SupportedGames />
            <Pricing />
            <FAQ />
            <CTA />
            <Contact />
            <Footer />
        </main>
    );
}
