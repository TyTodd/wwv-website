import PhotoText from "@/components/photo-text";
import ResumeIcon from "@/components/svg-icons/resume";
import Magnify from "@/components/svg-icons/magnify";
import Newsletter from "@/components/svg-icons/newsletter";
import Blog from "@/components/svg-icons/blog";
import Connect from "@/components/svg-icons/connect";
import TalentPool from "@/components/svg-icons/talent-pool";
import Candidates from "@/components/svg-icons/candidates";
import Pipeline from "@/components/svg-icons/pipeline";
import Women from "@/components/svg-icons/women";
import Unis from "@/components/svg-icons/unis";
import { SignUpButton } from "@clerk/nextjs";

export default function Offers() {
  return (
    <section className="relative before:absolute before:inset-0 before:-z-20 before:bg-gray-900 h-screen">
      <div className="flex flex-row h-full">
        <div className="bg-gray-900 flex flex-1 flex-col flex-grow">
          <div className="my-20 mx-10 flex flex-col flex-grow text-white">
            <h1 className="text-3xl font-bold mt-10 mb-8">For Students</h1>
            <div className="flex flex-col justify-around flex-grow">
              <PhotoText
                description="After submitting a brief resume-drop application, qualified candidates will be added to our applicant pool."
                delay={0}
              >
                <ResumeIcon height="40px" width="auto" />
              </PhotoText>
              <PhotoText
                description="Discover unique, curated opportunities at top startups that you won’t find anywhere else."
                delay={100}
              >
                <Magnify height="40px" width="auto" />
              </PhotoText>
              <PhotoText
                description="Stay updated on the latest entrepreneurship news and events with our weekly newsletter."
                delay={200}
              >
                <Newsletter height="40px" width="auto" />
              </PhotoText>
              <PhotoText
                description="Follow our blog for valuable educational resources and advice."
                delay={300}
              >
                <Blog height="40px" width="auto" />
              </PhotoText>
              <PhotoText
                description="Connect with others passionate about entrepreneurship by leveraging the WWV network and participating in our events."
                delay={400}
              >
                <Connect height="40px" width="auto" />
              </PhotoText>
            </div>
            <div className="flex flex-row mt-10">
              <SignUpButton>
                <button className="btn group mb-4 w-full bg-gradient-to-t from-[#FF989F] to-[#DB7B81] bg-[length:100%_100%] bg-[bottom] text-white shadow hover:bg-[length:100%_150%] sm:mb-0 sm:w-auto">
                  <span className="relative inline-flex items-center">
                    Apply{" "}
                    <span className="ml-1 tracking-normal text-[#a35d62] transition-transform group-hover:translate-x-0.5">
                      -&gt;
                    </span>
                  </span>
                </button>
              </SignUpButton>
            </div>
          </div>
        </div>
        <div className="bg-white flex flex-1 flex-col flex-grow">
          <div className="my-20 mx-10 text-gray-900 flex flex-col flex-grow">
            <h1 className="text-3xl font-bold mb-8 mt-10">For Startups</h1>
            <div className="flex flex-col justify-around flex-grow">
              <PhotoText
                description="Access to a top talent pool of highly motivated and skilled candidates from the top US universities."
                delay={0}
              >
                <TalentPool height="40px" width="auto" />
              </PhotoText>
              <PhotoText
                description="An efficient and streamlined hiring process. We present you with a shortlist of qualified and interested candidates within days."
                delay={100}
              >
                <Candidates height="40px" width="auto" />
              </PhotoText>
              <PhotoText
                description="Develop your talent pipeline, ensuring your team’s long-term success."
                delay={200}
              >
                <Pipeline height="40px" width="auto" />
              </PhotoText>
              <PhotoText
                description="Enhance your workplace culture through onboarding a young woman to accelerate growth, foster a vibrant workplace, and offer unique perspectives."
                delay={300}
              >
                <Women height="40px" width="auto" />
              </PhotoText>
              <PhotoText
                description="Access talent from top universities who bring access to world-class resources, innovation centers, and expansive networks to drive meaningful results for your startup."
                delay={400}
              >
                <Unis height="40px" width="auto" />
              </PhotoText>
            </div>
            <div className="mt-10">
              <a
                className="btn group mb-4 w-full bg-gradient-to-t from-[#FF989F] to-[#DB7B81] bg-[length:100%_100%] bg-[bottom] text-white shadow hover:bg-[length:100%_150%] sm:mb-0 sm:w-auto"
                href="/startups"
              >
                <span className="relative inline-flex items-center">
                  Learn more{" "}
                  <span className="ml-1 tracking-normal text-[#a35d62] transition-transform group-hover:translate-x-0.5">
                    -&gt;
                  </span>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="mx-auto px-4 sm:px-6">
        <div className="py-12 md:py-20">
          <div className="mx-auto max-w-3xl pb-16 text-center md:pb-20">
            <h2 className="text-3xl font-bold text-gray-200 md:text-4xl">
              The Problem
            </h2>
          </div>
        </div>
      </div> */}
    </section>
  );
}
