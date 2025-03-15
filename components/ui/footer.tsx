import Link from "next/link";
import Logo from "./logo";
import { SignUpButton } from "@clerk/nextjs";
export default function Footer({ border = false }: { border?: boolean }) {
  return (
    <footer>
      <div className="my-5 mx-auto px-4 sm:px-6">
        {/* Top area: Blocks */}
        {/* <div
          className={`grid gap-10 py-8 sm:grid-cols-12 md:py-12 ${border ? "border-t [border-image:linear-gradient(to_right,transparent,theme(colors.slate.200),transparent)1]" : ""}`}
        > */}
        <div className="absolute left-1/2 -translate-x-1/2 z-10 flex flex-col">
          {/* <div className="flex flex-row justify-between"> */}
          <div className="flex flex-row justify-center">
            <SignUpButton>
              <button className="text-gray-600 transition hover:text-gray-900 mb-3 underline">
                Apply
              </button>
            </SignUpButton>
            <Link
              className="text-gray-600 transition hover:text-gray-900 ml-10 mb-3 underline"
              href="https://blog.wwvlabs.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Blog
            </Link>
          </div>
          <div className="flex flex-row justify-center">
            <Link
              className="text-gray-600 transition hover:text-gray-900 mb-3 underline"
              href="mailto:info@wwvlabs.com"
            >
              info@wwvlabs.com
            </Link>
          </div>
          <div className="flex flex-row justify-center">
            <Link
              className="text-gray-600 transition hover:text-gray-900 mb-3 underline"
              href="/terms"
            >
              Terms of Service
            </Link>
          </div>

          {/* 5th block */}
          <div className="space-y-2 sm:col-span-6 md:col-span-3 lg:col-span-2 justify-center">
            {/* <h3 className="text-sm font-medium">Social</h3> */}
            <Link
              className="flex items-center justify-center text-blue-500 transition hover:text-blue-600"
              href="https://www.linkedin.com/company/wwv-labs"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <svg
                fill="#000000"
                height="20px"
                width="20px"
                version="1.1"
                id="Layer_1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 310 310"
              >
                <g id="XMLID_801_">
                  <path
                    id="XMLID_802_"
                    d="M72.16,99.73H9.927c-2.762,0-5,2.239-5,5v199.928c0,2.762,2.238,5,5,5H72.16c2.762,0,5-2.238,5-5V104.73
		C77.16,101.969,74.922,99.73,72.16,99.73z"
                  />
                  <path
                    id="XMLID_803_"
                    d="M41.066,0.341C18.422,0.341,0,18.743,0,41.362C0,63.991,18.422,82.4,41.066,82.4
		c22.626,0,41.033-18.41,41.033-41.038C82.1,18.743,63.692,0.341,41.066,0.341z"
                  />
                  <path
                    id="XMLID_804_"
                    d="M230.454,94.761c-24.995,0-43.472,10.745-54.679,22.954V104.73c0-2.761-2.238-5-5-5h-59.599
		c-2.762,0-5,2.239-5,5v199.928c0,2.762,2.238,5,5,5h62.097c2.762,0,5-2.238,5-5v-98.918c0-33.333,9.054-46.319,32.29-46.319
		c25.306,0,27.317,20.818,27.317,48.034v97.204c0,2.762,2.238,5,5,5H305c2.762,0,5-2.238,5-5V194.995
		C310,145.43,300.549,94.761,230.454,94.761z"
                  />
                </g>
              </svg>
            </Link>
          </div>
        </div>
        {/* </div> */}
      </div>
      {/* </div> */}

      {/* Big text */}
      <div className="relative -mt-16 h-60 w-full" aria-hidden="true">
        <div className="pointer-events-none absolute left-1/2 -z-10 -translate-x-1/2 text-center text-[348px] font-bold leading-none before:bg-gradient-to-b before:from-gray-200 before:to-gray-100/30 before:to-80% before:bg-clip-text before:text-transparent before:content-['WWV'] after:absolute after:inset-0 after:bg-gray-300/70 after:bg-clip-text after:text-transparent after:mix-blend-darken after:content-['WWV'] after:[text-shadow:0_1px_0_white]"></div>
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2/3"
          aria-hidden="true"
        >
          <div className="h-56 w-56 rounded-full border-[20px] border-blue-700 blur-[80px]"></div>
        </div>
      </div>
    </footer>
  );
}
