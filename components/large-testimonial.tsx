import Image, { StaticImageData } from "next/image";
import TestimonialImg from "@/public/images/large-testimonial.jpg";
import { Description } from "@headlessui/react";

interface TesteProps {
  name: string;
  school: string;
  message: string;
  src: StaticImageData;
}

const LargeTestimonial: React.FC<TesteProps> = ({
  name,
  school,
  message,
  src,
}) => {
  return (
    <div className="mx-auto max-w-2xl px-8 sm:px-12">
      <div className="py-12 md:py-20">
        <div className="space-y-3 text-center">
          <div className="relative inline-flex">
            <svg
              className="absolute -left-6 -top-2 -z-10"
              width={80}
              height={98}
              viewBox="0 0 40 49"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.7976 -0.000136375L39.9352 23.4746L33.4178 31.7234L13.7686 11.4275L22.7976 -0.000136375ZM9.34947 17.0206L26.4871 40.4953L19.9697 48.7441L0.320491 28.4482L9.34947 17.0206Z"
                fill="#D1D5DB"
              />
            </svg>
            <Image
              className="rounded-full"
              src={src}
              width={98}
              height={98}
              alt="Large testimonial"
            />
          </div>
          <p className="text-2xl font-bold text-gray-900">"{message}”</p>
          <div className="text-sm font-medium text-gray-500">
            <span className="text-gray-700">{name}</span>{" "}
            <span className="text-gray-400">/</span>{" "}
            <a className="text-blue-500" href="#0">
              {school}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LargeTestimonial;

// return (
//   <div className="mx-auto max-w-2xl px-4 sm:px-6">
//     <div className="py-12 md:py-20">
//       <div className="space-y-3 text-center">
//         <div className="relative inline-flex">
//           <svg
//             className="absolute -left-6 -top-2 -z-10"
//             width={80}
//             height={98}
//             viewBox="0 0 40 49"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               d="M22.7976 -0.000136375L39.9352 23.4746L33.4178 31.7234L13.7686 11.4275L22.7976 -0.000136375ZM9.34947 17.0206L26.4871 40.4953L19.9697 48.7441L0.320491 28.4482L9.34947 17.0206Z"
//               fill="#D1D5DB"
//             />
//           </svg>
//           <Image
//             className="rounded-full"
//             src={TestimonialImg}
//             width={98}
//             height={98}
//             alt="Large testimonial"
//           />
//         </div>
//         <p className="text-2xl font-bold text-gray-900">
//           "WWV Labs helped me land my internship at{" "}
//           <em className="italic text-gray-500">Scale AI</em>”
//         </p>
//         <div className="text-sm font-medium text-gray-500">
//           <span className="text-gray-700">Mary Sullivan</span>{" "}
//           <span className="text-gray-400">/</span>{" "}
//           <a className="text-blue-500" href="#0">
//             Student at Harvard University
//           </a>
//         </div>
//       </div>
//     </div>
//   </div>
// );
