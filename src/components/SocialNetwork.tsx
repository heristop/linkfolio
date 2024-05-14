"use client";
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { SocialNetworkProps } from "../types";

const SocialNetwork: React.FC<SocialNetworkProps> = ({
  config,
  delay = 0,
}: SocialNetworkProps) => {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Animate the element once it is in the viewport
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in-up-bounce");
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      },
    );

    const currentRef = ref.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      className="network flex items-start justify-center p-2 w-full md:w-1/4 rounded hover:bg-gray-200 hover:opacity-90 transition duration-300 ease-in-out opacity-0"
      style={{ animationDelay: `${delay}ms` }}
    >
      <Link href={config.url} target="blank" className="group">
        <div className="group-hover:animate-bounce flex justify-center">
          <Image
            src={config.iconSrc}
            alt={config.description}
            width={300}
            height={100}
            className="object-cover w-[300px] h-[100px] rounded-lg overflow-hidden shadow-lg"
            priority={true}
          />
        </div>

        <div className="data px-2 py-4">
          <h2 className="text-xl font-bold mb-2">{config.title}</h2>
          <p className="description text-gray-600 text-sm">
            {config.description}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default SocialNetwork;
