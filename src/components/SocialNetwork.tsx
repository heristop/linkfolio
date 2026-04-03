"use client";
import React, { useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import type { SocialNetworkProps } from "../types";

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
      data-group={config.group || "socialnetwork"}
      className="network flex flex-col items-center p-2 opacity-0 ease-[var(--ease-out-expo)]"
      style={{ animationDelay: `${delay}ms` }}
    >
      <Link
        href={config.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={config.title}
        className="group w-full"
      >
        <div className="group-hover:subtle-bounce flex justify-center">
          <div className="lf-icon-container relative w-full max-w-xs mx-auto h-24 overflow-hidden rounded-lg">
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

        <div className="lf-data px-2 py-4 text-center">
          <h2 className="lf-title text-xl font-bold mb-2">{config.title}</h2>
          <p className="lf-description description text-sm truncate text-[var(--lf-description-color)]">
            {config.description}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default SocialNetwork;
