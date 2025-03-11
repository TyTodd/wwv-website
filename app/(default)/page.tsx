export const metadata = {
  title: "WWV Labs",
  description: "Page description",
};

import Hero from "@/components/hero-home";
import BusinessCategories from "@/components/business-categories";
import Offers from "@/components/offers";
import LargeTestimonial from "@/components/large-testimonial";
import Cta from "@/components/cta";
import Stats from "@/components/stats";
import Testimonials from "@/components/testimonials";

export default function Home() {
  return (
    <>
      <Hero />
      {/* <BusinessCategories /> */}
      <Stats />
      <Offers />
      {/* <LargeTestimonial /> */}
      {/* <Cta /> */}
      <Testimonials />
    </>
  );
}
