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

  const callback = useCallback(
    (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in-up-bounce");
          observer.unobserve(entry.target);
        }
      });
    },
    [],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(callback, {
      root: null,
      rootMargin: "50px",
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
      className="network flex flex-col items-center p-2 w-full md:w-1/3 lg:w-1/4 rounded-lg hover:bg-neutral-300/20 transition-colors duration-300 opacity-0"
      style={{ animationDelay: `${delay}ms`, transitionTimingFunction: "var(--ease-out-expo)" }}
    >
      <Link
        href={config.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${config.title} (opens in a new tab)`}
        className="group w-full"
      >
        <div className="group-hover:subtle-bounce flex justify-center">
          <div className="relative w-full max-w-xs mx-auto h-24 overflow-hidden rounded-lg shadow-lg">
            <Image
              src={config.iconSrc}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              quality={100}
              priority
            />
          </div>
        </div>

        <div className="data px-2 py-4 text-center">
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
