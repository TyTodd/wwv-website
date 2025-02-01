import React, { ReactNode } from "react";

interface StatProps {
  title: string;
  description: string;
}

const Stat: React.FC<StatProps> = ({ title, description }) => {
  return (
    <div className="flex flex-col items-center text-center mx-10 text-black">
      <span className="flex flex-row">
        {title.split("").map((c, index) => (
          <h2
            key={index}
            className="text-9xl font-bold"
            data-aos="fade-up"
            data-aos-delay={index * 200 + 200}
          >
            {c}
          </h2>
        ))}
      </span>
      <span
        data-aos="fade-up"
        data-aos-delay={title.length * 200}
        className="text-xl "
      >
        {description}
      </span>
    </div>
  );
};
export default Stat;
