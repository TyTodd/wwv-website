import Image from "next/image";
import TestimonialImg from "@/public/images/large-testimonial.jpg";
import ReviewScroller from "@/components/review-scroller";

export default function Testimonials() {
  return (
    <section className="flex flex-row">
      <ReviewScroller color="white" />
    </section>
  );
}
