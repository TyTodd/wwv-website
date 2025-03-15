"use client";
import Image from "next/image";
import PageIllustration from "@/components/page-illustration";
import Avatar01 from "@/public/images/avatar-01.jpg";
import Avatar02 from "@/public/images/avatar-02.jpg";
import Avatar03 from "@/public/images/avatar-03.jpg";
import Avatar04 from "@/public/images/avatar-04.jpg";
import Avatar05 from "@/public/images/avatar-05.jpg";
import Avatar06 from "@/public/images/avatar-06.jpg";
import women_at_table from "@/public/images/unsplash-image-ZKHksse8tUU.jpg";
import InfiniteScrollingLogosAnimation from "@/components/school-scroller";
export default function HeroStartups() {
  return (
    <section className="relative min-h-screen">
      <PageIllustration />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-screen flex items-center">
        {/* Hero content */}
        {/* <div className="w-full"> */}
        <div className="flex flex-col h-full w-full justify-around">
          {/* Section header */}
          <div className="text-center">
            <div
              className="mb-6 border-y [border-image:linear-gradient(to_right,transparent,theme(colors.slate.300/.8),transparent)1]"
              data-aos="zoom-y-out"
            ></div>
            <h1
              className="mb-6 border-y text-5xl font-bold [border-image:linear-gradient(to_right,transparent,theme(colors.slate.300/.8),transparent)1] md:text-6xl"
              data-aos="zoom-y-out"
              data-aos-delay={150}
            >
              Find the top, young talent
            </h1>
            <div className="mx-auto">
              <p
                className="mb-8 text-xl text-gray-700"
                data-aos="zoom-y-out"
                data-aos-delay={300}
              >
                Access our talent pool of top students and graduates from
                leading US universities. Hire exceptional candidates across
                engineering, sales, product, marketing, operations, and more.
              </p>
              <div className="flex w-full justify-center flex-col">
                <div className="relative before:absolute before:inset-0 before:border-y before:[border-image:linear-gradient(to_right,transparent,theme(colors.slate.300/.8),transparent)1]">
                  <div
                    className="mx-auto max-w-xs sm:flex sm:max-w-none sm:justify-center"
                    data-aos="zoom-y-out"
                    data-aos-delay={450}
                  >
                    <a
                      className="btn group mb-4 w-full bg-gradient-to-t from-[#FF989F] to-[#DB7B81] bg-[length:100%_100%] bg-[bottom] text-white shadow hover:bg-[length:100%_150%] sm:mb-0 sm:w-auto"
                      href="https://tally.so/r/wLJA8v"
                    >
                      <span className="relative inline-flex items-center">
                        Submit a Job Request{" "}
                        <span className="ml-1 tracking-normal text-[#a35d62] transition-transform group-hover:translate-x-0.5">
                          -&gt;
                        </span>
                      </span>
                    </a>
                    <a
                      className="btn w-full bg-white text-gray-800 shadow hover:bg-gray-50 sm:ml-4 sm:w-auto"
                      href="https://calendly.com/adrian_arnaboldi/wwv-labs-meeting"
                    >
                      Schedule a Call
                    </a>
                  </div>
                </div>
                <div className="">
                  {/* <Image
                    src={women_at_table}
                    className="pt-10 object-contain"
                    alt="women at table"
                  /> */}
                </div>
              </div>
              {/* <InfiniteScrollingLogosAnimation /> */}
            </div>
            {/* <InfiniteScrollingLogosAnimation /> */}
          </div>
          <div className="">
            <InfiniteScrollingLogosAnimation />
          </div>
        </div>
      </div>
    </section>
  );
}
