import React, { ReactNode } from "react";
import Image, { StaticImageData } from "next/image";

interface CardProps {
  title: string;
  subtitle: string;
  description: string;
  src: StaticImageData;
}

const StartupInfoCard: React.FC<CardProps> = ({
  title,
  subtitle,
  description,
  src,
}) => {
  return (
    <div
      data-aos="flip-down"
      data-aos-delay={100}
      className="flex flex-row m-5"
    >
      <div className="flex-1 px-6 py-4">
        <div className="">
          <div className="font-bold text-8xl mb-2">{title}</div>
          <div className="font-bold text-3xl mb-2">{subtitle}</div>
          <p className="text-gray-700 text-base">{description}</p>
        </div>
      </div>
      <div className="flex-1">
        <Image
          src={src}
          alt={title}
          className="object-contain rounded-lg shadow-md"
        />
      </div>
    </div>
  );
};

export default StartupInfoCard;
