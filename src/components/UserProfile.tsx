"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { UserProfileProps } from "../types";
import { defaultAvatarIcon } from "../assets";

const UserProfile: React.FC<UserProfileProps> = ({ userConfig }) => {
  const aliasText = userConfig.alias;

  const [isMounted, setIsMounted] = useState(false);
  const [typing, setTyping] = useState(false);
  const [alias, setAlias] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const typeAlias = useCallback(() => {
    if (!aliasText) return;

    if (typing && index < aliasText.length) {
      const timeoutId = setTimeout(() => {
        setAlias((prev) => prev + aliasText[index]);
        setIndex((prev) => prev + 1);
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [aliasText, typing, index]);

  useEffect(() => {
    if (userConfig.enableTypingAlias) {
      typeAlias();
    }
  }, [userConfig.enableTypingAlias, typeAlias]);

  useEffect(() => {
    if (userConfig.enableTypingAlias && isMounted) {
      const timeoutId = setTimeout(() => setTyping(true), 300);
      return () => clearTimeout(timeoutId);
    }
  }, [isMounted, userConfig.enableTypingAlias]);

  return (
    <header className="profile mt-2 mb-12 text-center">
      <Image
        src={userConfig.avatarSrc ?? defaultAvatarIcon}
        alt={userConfig.avatarAlt ?? "Avatar"}
        width={userConfig.avatarSize ?? 120}
        height={userConfig.avatarSize ?? 120}
        className="avatar rounded-full mb-6 mx-auto shadow-lg transition-shadow duration-300 glitter-effect fade-in"
        style={{ animationDelay: "0.1s" }}
        priority
      />

      <h1
        className="fullname text-2xl font-semibold fade-in"
        style={{ animationDelay: "0.25s" }}
      >
        {userConfig.fullName ?? "Your Name"}
      </h1>

      <p
        className="alias mt-2 text-base text-neutral-600 font-semibold fade-in"
        style={{ animationDelay: "0.4s" }}
      >
        {userConfig.enableTypingAlias ? (
          <>
            <span className="sr-only">{aliasText}</span>
            <span className="alias-typing" aria-hidden="true">{alias}</span>
          </>
        ) : (
          aliasText
        )}
      </p>

      <div
        className="w-12 h-0.5 bg-current opacity-30 mt-4 mx-auto origin-left reveal-line"
        style={{ animationDelay: "0.55s" }}
        role="presentation"
      />
    </header>
  );
};

export default UserProfile;
