import Image from "next/image";
import PlanetImg from "@/public/images/planet.png";
import PlanetOverlayImg from "@/public/images/planet-overlay.svg";
import PlanetTagImg01 from "@/public/images/planet-tag-01.png";
import PlanetTagImg02 from "@/public/images/planet-tag-02.png";
import PlanetTagImg03 from "@/public/images/planet-tag-03.png";
import PlanetTagImg04 from "@/public/images/planet-tag-04.png";
import InfiniteScrollingLogosAnimation from "@/components/logo-scroller";
import SimpleCard from "@/components/simple-card";
import Stat from "@/components/stat";

export default function Stats() {
  return (
    // <section className="relative before:absolute before:inset-0 before:-z-20 before:bg-gray-900 pb-10">
    <section className="relative before:absolute before:inset-0 before:-z-20 before:bg-[#CFDEEE] h-screen">
      <div className="flex flex-col h-full">
        <div className="flex flex-row mt-20 text-white pb-20 pt-10 h-20">
          <Stat
            title="6:1"
            description="Men outnumber women in new startup founder roles by nearly six to one.
"
          />
          <Stat
            title="15%"
            description="Women make up less than 15% of the workforce in over one in five startups.
"
          />
          <Stat
            title="76%"
            description="Between 2019 and 2023, 76% of all equity issued to startup employees went to men.
"
          />
        </div>
        {/* <div className="bg-green-500" /> */}
        <div className="flex flex-col items-center h-200 mt-auto mb-20">
          <InfiniteScrollingLogosAnimation color="#CFDEEE" />
        </div>
      </div>
    </section>
  );
}
