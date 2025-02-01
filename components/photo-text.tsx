import React, { ReactNode } from "react";

interface PTProps {
  description: string;
  delay: number;
  children: ReactNode;
}

const PhotoText: React.FC<PTProps> = ({ description, delay, children }) => {
  return (
    <div
      data-aos="flip-down"
      data-aos-delay={delay}
      className="flex items-center p-auto h-15"
    >
      <div className="shrink-0">{children}</div>
      <span className="ml-3 flex items-center">{description}</span>
    </div>
  );
};

export default PhotoText;
