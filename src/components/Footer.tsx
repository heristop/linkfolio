import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FooterProps } from "../types";
import { linkfolioIcon } from "../assets";

const Footer: React.FC<FooterProps> = ({ children }) => {
  return (
    <footer className="w-48 mx-auto mt-8 bg-neutral-150 text-neutral-600 px-6 py-2 text-xs rounded-sm">
      <Link
        className="flex flex-col items-center justify-center"
        href="https://github.com/heristop/linkfolio"
        target="_blank"
        rel="noreferrer"
      >
        <div className="relative w-10 h-10">
          <Image
            src={linkfolioIcon}
            alt="Linkfolio Logo"
            title="Linkfolio Logo"
            fill
            sizes="40px"
            className="drop-shadow-lg object-contain"
          />
        </div>

        <div className="text-xs mt-2 drop-shadow-lg">
          {children?.defaultContent || "Made by heristop"}
        </div>
      </Link>
    </footer>
  );
};

export default Footer;
