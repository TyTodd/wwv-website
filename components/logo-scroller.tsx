"use client";
import { DotIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import company_logo from "@/public/images/company-logo.png";

const CompanyLogoData: Array<{ src: any; alt: string }> = [
  { src: company_logo, alt: "Acme Logo" },
  { src: company_logo, alt: "Quantum Logo" },
  { src: company_logo, alt: "Echo Logo" },
  { src: company_logo, alt: "Celestial Logo" },
  { src: company_logo, alt: "Pulse Logo" },
  { src: company_logo, alt: "Apex Logo" },
];

const InfiniteScrollingLogosAnimation = () => {
  return (
    <div className="container p-5 w-full">
      <h2 className="text-center text-xl text-white/70 my-5">Our partners</h2>
      <div className="flex relative overflow-hidden before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-10 before:bg-gradient-to-r before:from-[#f8fafc] before:to-transparent before:content-[''] after:absolute after:right-0 after:top-0 after:h-full after:w-10 after:bg-gradient-to-l after:from-[#f8fafc] after:to-transparent after:content-['']">
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
