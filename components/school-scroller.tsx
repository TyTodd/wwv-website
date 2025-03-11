"use client";
import { DotIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import company_logo from "@/public/images/company-logo1.png";

const CompanyLogoData: Array<{ src: any; alt: string }> = [
  { src: company_logo, alt: "Harvard" },
  { src: company_logo, alt: "MIT" },
  { src: company_logo, alt: "Berkeley" },
  { src: company_logo, alt: "Stanford" },
  { src: company_logo, alt: "Northeastern" },
  { src: company_logo, alt: "Columbia" },
];
interface ScrollerProps {
  color: string;
}
const InfiniteScrollingLogosAnimation = () => {
  return (
    <div className="container p-5 w-full mt-auto">
      <h2 className="text-center my-5 text-lg text-gray-700">
        Hire from a pool of 1,000+ top students and graduates with expertise in
        engineering, AI/ML, marketing, and operations, from leading universities
        such as
      </h2>
      <div
        // className={`flex relative overflow-hidden before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-10 before:bg-gradient-to-r before:from-[${color}] before:to-transparent before:content-[''] after:absolute after:right-0 after:top-0 after:h-full after:w-10 after:bg-gradient-to-l after:from-[${color}] after:to-transparent after:content-['']`}
        // className="relative flex overflow-hidden before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-10 before:bg-gradient-to-r before:from-[#CFDEEE] before:to-transparent before:content-[''] after:absolute after:right-0 after:top-0 after:h-full after:w-10 after:bg-gradient-to-l after:from-[#CFDEEE] after:to-transparent after:content-['']"
        className="relative flex overflow-hidden before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-10 before:content-[''] after:absolute after:right-0 after:top-0 after:h-full after:w-10 after:content-['']"
      >
        <motion.div
          transition={{
            duration: 10,
            ease: "linear",
            repeat: Infinity,
          }}
          initial={{ translateX: 0 }}
          animate={{ translateX: "-50%" }}
          className="flex flex-none gap-16 pr-16"
        >
          {[...new Array(2)].fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {CompanyLogoData.map(({ src, alt }) => (
                <Image
                  key={alt}
                  src={src}
                  alt={alt}
                  className="h-20 w-auto flex-none"
                />
              ))}
            </React.Fragment>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default InfiniteScrollingLogosAnimation;
