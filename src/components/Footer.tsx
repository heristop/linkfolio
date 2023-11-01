import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FooterProps } from "../types";
import { linkfolioIcon } from "../assets";

const Footer = ({ children }: FooterProps) => {
  return (
    <footer className="w-48 mx-auto mt-10 bg-gray-150 text-gray-600 px-6 py-2 text-xs rounded">
      <Link
        className="flex flex-col items-center justify-center"
        href="https://github.com/heristop/linkfolio"
        target="_blank"
        rel="noreferrer"
      >
        <Image
          src={linkfolioIcon}
          title="LinkFolio"
          alt="LinkFolio"
          width={40}
          height={40}
        />

        {children && children.defaultContent ? (
          children.defaultContent
        ) : (
          <div className="mt-2">Made by heristop</div>
        )}
      </Link>
    </footer>
  );
};

export default Footer;
