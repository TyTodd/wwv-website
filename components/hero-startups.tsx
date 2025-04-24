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
              <div className="flex w-full justify-center flex-col mt-10">
                <div className="relative py-8 px-4 sm:px-8 bg-white bg-opacity-90 rounded-2xl shadow-xl border border-gray-100 backdrop-blur-sm">
                  <div className="absolute inset-x-0 -top-1 h-px bg-gradient-to-r from-transparent via-[#FF989F] to-transparent"></div>
                  <div className="absolute inset-x-0 -bottom-1 h-px bg-gradient-to-r from-transparent via-[#FF989F] to-transparent"></div>
                  
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Ready to find your perfect candidate?</h3>
                  
                  <div
                    className="flex flex-col sm:flex-row sm:justify-center gap-4 mt-6"
                    data-aos="zoom-y-out"
                    data-aos-delay={450}
                  >
                    <a
                      className="inline-flex items-center justify-center px-6 py-3.5 text-base font-medium text-white bg-gradient-to-r from-[#FF989F] to-[#DB7B81] rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#DB7B81]"
                      href="https://tally.so/r/wLJA8v"
                    >
                      <span className="relative inline-flex items-center">
                        Submit a Job Request
                        <svg className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </a>
                    <a
                      className="inline-flex items-center justify-center px-6 py-3.5 text-base font-medium text-gray-800 bg-white border border-gray-200 rounded-lg shadow-sm transition duration-300 ease-in-out transform hover:scale-105 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
                      href="https://calendly.com/adrian_arnaboldi/wwv-labs-meeting"
                    >
                      <svg className="mr-2 w-4 h-4 text-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      Schedule a Call
                    </a>
                  </div>
                  
                  <p className="text-gray-500 text-sm text-center mt-6">
                    Join 200+ startups already hiring top female talent through our platform
                  </p>
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
