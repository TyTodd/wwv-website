import SVGProps from "@/components/svg-icons/svg";
const Blog: React.FC<SVGProps> = ({ height, width }) => {
  return (
    <div className="svg-icon-light">
      <svg
        width={width}
        height="35px"
        viewBox="0 0 24 24"
        // xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <style>{`.cls-1{fill:none;stroke-miterlimit:10;stroke-width:1.92px;}`}</style>
        </defs>

        <g id="roll_brush" data-name="roll brush">
          <line className="cls-1" x1="5.24" y1="11.08" x2="18.66" y2="11.08" />

          <line className="cls-1" x1="5.24" y1="18.76" x2="18.66" y2="18.76" />

          <line className="cls-1" x1="5.24" y1="14.92" x2="18.66" y2="14.92" />

          <rect className="cls-1" x="1.4" y="1.49" width="21.1" height="21.1" />

          <polygon
            className="cls-1"
            points="22.5 7.25 16.23 7.25 14.31 7.25 1.4 7.25 1.4 1.49 22.5 1.49 22.5 7.25"
          />

          <line className="cls-1" x1="4.28" y1="4.37" x2="6.2" y2="4.37" />

          <line className="cls-1" x1="8.11" y1="4.37" x2="10.03" y2="4.37" />

          <line className="cls-1" x1="11.95" y1="4.37" x2="13.87" y2="4.37" />
        </g>
      </svg>
    </div>
  );
};

export default Blog;
