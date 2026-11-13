import { FifteenDayMenu } from "@/components/food-showcase/fifteen-day-menu";
import { Footer } from "@/components/footer/footer";
import { Hero } from "@/components/hero/hero";
import { TiffinPackages } from "@/components/menu/tiffin-packages";
import { Navbar } from "@/components/navbar/navbar";
import { OrderSection } from "@/components/order/order-section";
import { About } from "@/components/sections/about";
import { Faq } from "@/components/sections/faq";
import { KitchenStory } from "@/components/sections/kitchen-story";
import { Testimonials } from "@/components/sections/testimonials";
import { WhyChoose } from "@/components/sections/why-choose";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main id="main">
        <Hero />
        <TiffinPackages />
        <FifteenDayMenu />
        <WhyChoose />
        <KitchenStory />
        <About />
        {/* Renders only once real testimonials are added to menu-data.ts */}
        <Testimonials />
        <OrderSection />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
