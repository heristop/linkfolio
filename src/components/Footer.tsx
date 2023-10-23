import Image from "next/image";
import { FooterProps } from "../types";
import { linkfolioIcon } from "../assets";

function Footer({ children }: FooterProps) {
  return (
    <footer className="w-48 mx-auto mt-10 bg-gray-150 text-gray-600 px-6 py-2 text-xs rounded">
      <a
        className="flex flex-col items-center justify-center"
        href="https://github.com/heristop/linkfolio"
        target="_blank"
        rel="noreferrer"
      >
        <Image
          src={linkfolioIcon}
          title="LinkFolio"
          alt="LinkFolio"
          width={30}
          height={30}
        />

        {children && children.defaultContent ? (
          children.defaultContent
        ) : (
          <div className="mt-2">Made by heristop</div>
        )}
      </a>
    </footer>
  );
}

export default Footer;
