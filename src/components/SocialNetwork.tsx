"use client";
import React, { useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { SocialNetworkProps } from "../types";

const SocialNetwork: React.FC<SocialNetworkProps> = ({
  config,
  delay = 0,
}: SocialNetworkProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const callback = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in-up-bounce");
      }
    });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(callback, {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    });

    const currentRef = ref.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [callback]);

  return (
    <div
      ref={ref}
      className="network flex items-start justify-center p-2 w-full md:w-1/4 rounded-lg hover:bg-neutral-300/20 transition duration-300 ease-in-out opacity-0"
      style={{ animationDelay: `${delay}ms` }}
    >
      <Link
        href={config.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group w-full"
      >
        <div className="group-hover:animate-bounce flex justify-center">
          <Image
            src={config.iconSrc}
            alt={config.title}
            width={300}
            height={100}
            className="object-cover w-64 h-24 rounded-lg overflow-hidden shadow-lg"
            priority
          />
        </div>

        <div className="data px-2 py-4">
          <h2 className="text-xl font-bold mb-2">{config.title}</h2>
          <p className="description text-neutral-600 text-sm truncate">
            {config.description}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default SocialNetwork;
