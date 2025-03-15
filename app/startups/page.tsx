export const metadata = {
  title: "WWV Labs - For Startups",
  description: "Page description",
};

import Hero from "@/components/hero-startups";
import HowItWorks from "@/components/how-works";

export default function Home() {
  return (
    <>
      <Hero />
      <HowItWorks />
    </>
  );
}
