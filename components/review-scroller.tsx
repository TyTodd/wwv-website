"use client";
import { DotIcon } from "@radix-ui/react-icons";
import React, { ReactNode } from "react";
import { motion } from "framer-motion";
import LargeTestimonial from "@/components/large-testimonial";
import KatherineH from "@/public/images/KatherineH.png";
import AmandaT from "@/public/images/AmandaT.png";

const CompanyLogoData: Array<ReactNode> = [
  <LargeTestimonial
    name="Katherine Harvey"
    school="Computer Science student at Harvard University"
    message="Through this experience, I got to work on real-world projects with direct impact. We just deployed the work I had been developing, revamping the entire website and mobile experience—it was incredibly rewarding to see it go live."
    src={KatherineH}
  />,
  <LargeTestimonial
    name="Amanda T."
    school="MIT Computation and Cognition recent graduate"
    message="This was my first time working closely with a startup, and I definitely learned a lot. It helped me improve my design skills, problem-solving abilities, and gain hands-on experience in a real company setting."
    src={AmandaT}
  />,
  <LargeTestimonial
    name="Katherine Harvey"
    school="Computer Science student at Harvard University"
    message="Through this experience, I got to work on real-world projects with direct impact. We just deployed the work I had been developing, revamping the entire website and mobile experience—it was incredibly rewarding to see it go live."
    src={KatherineH}
  />,
  <LargeTestimonial
    name="Amanda T."
    school="MIT Computation and Cognition recent graduate"
    message="This was my first time working closely with a startup, and I definitely learned a lot. It helped me improve my design skills, problem-solving abilities, and gain hands-on experience in a real company setting."
    src={AmandaT}
  />,
];
interface ScrollerProps {
  color: string;
}
const ReviewScroller: React.FC<ScrollerProps> = ({ color }) => {
  const scrolls = CompanyLogoData.length;
  const k = scrolls * 2;
  const a = 1 / 6;
  const transTime = a / Math.ceil((k - 1) / 2);
  const holdTime = (1 - a) / Math.floor((k - 1) / 2);
  let lastTime = 0;
  let animTimes = [];
  for (let i = 0; i < k; i++) {
    animTimes.push(lastTime);
    if (i % 2 == 0) {
      lastTime += transTime;
    } else {
      lastTime += holdTime;
    }
  }
  //   const animTimes = Array.from({ length: k }, (_, i) => i / k);
  let animPos = [];
  const posDif = 100 / (scrolls * 2);
  let last = 0;
  for (let i = 0; i < scrolls; i++) {
    animPos.push(`-${last}%`);
    last += posDif;
    // last = Math.round(last);
    animPos.push(`-${last}%`);
  }
  const duration = CompanyLogoData.length * 2;
  return (
    <div className="flex w-full flex-col">
      <div className="flex flex-row  mr-20 ml-10 mt-20">
        <span className="text-4xl font-bold"> Testimonials</span>
        {/* <div className="flex flex-row">
          <button
            className="mr-10 btn group mb-4 w-full bg-gradient-to-t from-[#FF989F] to-[#DB7B81] bg-[length:100%_100%] bg-[bottom] text-white shadow hover:bg-[length:100%_150%] sm:mb-0 sm:w-auto"
            // href="#0"
          >
            <span className="relative inline-flex items-center">
              <span className="text-3xl ml-1 tracking-normal text-[#a35d62] transition-transform group-hover:-translate-x-0.5">
                &lt;-
              </span>
            </span>
          </button>
          <button
            className="btn group mb-4 w-full bg-gradient-to-t from-[#FF989F] to-[#DB7B81] bg-[length:100%_100%] bg-[bottom] text-white shadow hover:bg-[length:100%_150%] sm:mb-0 sm:w-auto"
            // href="#0"
          >
            <span className="relative inline-flex items-center">
              <span className="text-3xl ml-1 tracking-normal text-[#a35d62] transition-transform group-hover:translate-x-0.5">
                -&gt;
              </span>
            </span>
          </button>
        </div> */}
      </div>
      <div className="container max-w-[95%] flex mx-auto">
        <div
          // className={`flex relative overflow-hidden before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-10 before:bg-gradient-to-r before:from-[${color}] before:to-transparent before:content-[''] after:absolute after:right-0 after:top-0 after:h-full after:w-10 after:bg-gradient-to-l after:from-[${color}] after:to-transparent after:content-['']`}
          className="relative flex overflow-hidden"
        >
          <motion.div
            transition={{
              duration: duration,
              ease: "easeOut",
              repeat: Infinity,
              times: animTimes,
            }}
            initial={{ translateX: 0 }}
            animate={{
              translateX: animPos,
            }}
            className="flex flex-none gap-16 pr-16"
          >
            {[...new Array(2)].fill(0).map((_, index) => (
              <React.Fragment key={index}>{CompanyLogoData}</React.Fragment>
            ))}
          </motion.div>
        </div>
      </div>{" "}
    </div>
  );
};

export default ReviewScroller;
