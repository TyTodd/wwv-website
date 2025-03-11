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
import StartupInfoCard from "./startup-info-card";
import women_at_table from "@/public/images/unsplash-image-ZKHksse8tUU.jpg";

export default function HowItWorks() {
  return (
    // <section className="relative before:absolute before:inset-0 before:-z-20 before:bg-gray-900 pb-10">
    <section className="relative before:absolute before:inset-0 before:-z-20 before:bg-transparent">
      <div className="flex flex-col h-full mb-40">
        <StartupInfoCard
          title="01"
          subtitle="Tell us more about the positions you are hiring for."
          description="Share details about the roles you are hiring for by scheduling a call with us or completing the job description form. See the links below."
          src={women_at_table}
        />
        <StartupInfoCard
          title="02"
          subtitle="We identify the top talent."
          description="Using the job description, we identify top candidates from our curated database and, if necesarry, extend the search to our broader network. Once identified, we reach out to candidates to guage their interest and gather relevant application materials. Candidates are also encouraged to refer others who may be a great fit for the role."
          src={women_at_table}
        />
        <StartupInfoCard
          title="03"
          subtitle="Hire Exceptional Talent with Ease"
          description="We provide you with a detailed memo of interested candidates, including their resumes, LinkedIn profiles, and a brief summary of their interest in the role. You select who to interview, seamlessly manage the process, and hire the best candidate(s) to join your team."
          src={women_at_table}
        />
      </div>
    </section>
  );
}
