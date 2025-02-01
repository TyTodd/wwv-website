"use client";
import { DotIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import company_logo from "@/public/images/company-logo1.png";
import drlullaby from "@/public/images/drlullaby.jpg";
import GIA from "@/public/images/GIA.png";
import bird from "@/public/images/bird.png";
import olive from "@/public/images/olive.png";

const CompanyLogoData: Array<{ src: any; alt: string }> = [
  { src: drlullaby, alt: "DrLullaby" },
  { src: GIA, alt: "GIA" },
  { src: bird, alt: "bird" },
  { src: olive, alt: "Olive" },
  { src: drlullaby, alt: "DrLullaby" },
  { src: GIA, alt: "GIA" },
  { src: bird, alt: "bird" },
  { src: olive, alt: "Olive" },
];
interface ScrollerProps {
  color: string;
}
const InfiniteScrollingLogosAnimation: React.FC<ScrollerProps> = ({
  color,
}) => {
  return (
    <div className="container p-5 w-full mt-auto">
      <h2 className="text-center text-xl text-black my-5">Our partners</h2>
      <div
        // className={`flex relative overflow-hidden before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-10 before:bg-gradient-to-r before:from-[${color}] before:to-transparent before:content-[''] after:absolute after:right-0 after:top-0 after:h-full after:w-10 after:bg-gradient-to-l after:from-[${color}] after:to-transparent after:content-['']`}
        className="relative flex overflow-hidden before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-10 before:bg-gradient-to-r before:from-[#CFDEEE] before:to-transparent before:content-[''] after:absolute after:right-0 after:top-0 after:h-full after:w-10 after:bg-gradient-to-l after:from-[#CFDEEE] after:to-transparent after:content-['']"
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
