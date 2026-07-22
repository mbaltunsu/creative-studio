import { Navbar } from "@/components/layout/navbar";
import { Hero } from "@/components/sections/hero";
import { MosaicReel } from "@/components/sections/mosaic-reel";
import { SelectedProjects } from "@/components/sections/selected-projects";
import { WhatWeDo } from "@/components/sections/what-we-do";
import { ProjectPath } from "@/components/sections/project-path";
import { IndustriesMarquee } from "@/components/sections/industries-marquee";
import { FourteenDays } from "@/components/sections/fourteen-days";
import { Footer } from "@/components/layout/footer";
import { CustomCursor } from "@/components/anim/custom-cursor";

export default function Home() {
  return (
    <>
      <Navbar />
      {/* Plain block flow — pinned sections insert pin-spacers as siblings. */}
      <main>
        <Hero />
        <MosaicReel />
        <SelectedProjects />
        <WhatWeDo />
        <ProjectPath />
        <IndustriesMarquee />
        <FourteenDays />
      </main>
      <Footer />
      <CustomCursor />
    </>
  );
}
