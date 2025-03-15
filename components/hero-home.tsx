"use client";
import PageIllustration from "@/components/page-illustration";
import { SignUpButton } from "@clerk/nextjs";

export default function HeroHome() {
  return (
    <section className="relative min-h-screen">
      <PageIllustration />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-screen flex items-center">
        {/* Hero content */}
        <div className="w-full">
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
              Smart startups hire smart women.
            </h1>
            <div className="mx-auto">
              <p
                className="mb-8 text-lg text-gray-700"
                data-aos="zoom-y-out"
                data-aos-delay={300}
              >
                WWV Labs connects top female student and recent graduate talent
                with high-growth, vetted startups.
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
                      href="/startups"
                    >
                      <span className="relative inline-flex items-center">
                        Find you next hire{" "}
                        <span className="ml-1 tracking-normal text-[#a35d62] transition-transform group-hover:translate-x-0.5">
                          -&gt;
                        </span>
                      </span>
                    </a>
                    <SignUpButton>
                      <button className="btn w-full bg-white text-gray-800 shadow hover:bg-gray-50 sm:ml-4 sm:w-auto">
                        Find your next job
                      </button>
                    </SignUpButton>
                  </div>
                </div>
                <div className=""></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
