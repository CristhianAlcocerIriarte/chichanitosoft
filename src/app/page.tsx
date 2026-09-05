import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Approach } from "@/components/sections/Approach";
import { Contact } from "@/components/sections/Contact";
import { ScrollProgress } from "@/components/ui/ScrollProgress";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Services />
        <Approach />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
