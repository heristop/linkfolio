"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import type { UserProfileProps } from "../types";
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
    <header className="profile mt-2 text-center mb-[var(--lf-profile-margin-bottom)]">
      <Image
        src={userConfig.avatarSrc ?? defaultAvatarIcon}
        alt={userConfig.avatarAlt ?? "Avatar"}
        width={userConfig.avatarSize ?? 120}
        height={userConfig.avatarSize ?? 120}
        className="lf-avatar avatar rounded-full mb-6 mx-auto fade-in"
        style={{ animationDelay: "0.05s" }}
        priority
      />

      <h1
        className="lf-name fullname fade-in text-[length:var(--lf-name-font-size)] font-[var(--lf-name-font-weight)] text-[var(--lf-name-color)]"
        style={{ animationDelay: "0.15s" }}
      >
        {userConfig.fullName ?? "Your Name"}
      </h1>

      <p
        className="lf-alias alias mt-2 text-base font-semibold fade-in text-[var(--lf-alias-color)]"
        style={{ animationDelay: "0.25s" }}
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
        className="lf-accent-line origin-left reveal-line w-[var(--lf-accent-line-width)] h-0.5 bg-[var(--lf-accent-line-color)] opacity-[var(--lf-accent-line-opacity)] mt-4 mx-auto"
        style={{ animationDelay: "0.35s" }}
        role="presentation"
      />
    </header>
  );
};

export default UserProfile;
