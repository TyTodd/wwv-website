import React from "react";

interface CardProps {
  title: string;
  description: string;
  delay: number;
  children: ReactNode;
}

const SimpleCard: React.FC<CardProps> = ({
  title,
  description,
  delay,
  children,
}) => {
  return (
    <div
      data-aos="flip-down"
      data-aos-delay={delay}
      className="flex-1 rounded overflow-hidden shadow-lg bg-white border border-gray-200 m-5"
    >
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{title}</div>
        {children}
        {/* <p className="text-gray-700 text-base">{description}</p> */}
      </div>
    </div>
  );
};

export default SimpleCard;
