"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import type { UserProfileProps } from "../types";
import { defaultAvatarIcon } from "../assets";

const UserProfile: React.FC<UserProfileProps> = ({
  userConfig,
  headingLevel,
}) => {
  const aliasText = userConfig.alias;
  const HeadingTag = headingLevel ?? "h1";

  const [isMounted, setIsMounted] = useState(false);
  const [typing, setTyping] = useState(false);
  const [alias, setAlias] = useState("");
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);

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

    if (typing && index >= aliasText.length && !done) {
      const timeoutId = setTimeout(() => setDone(true), 1500);
      return () => clearTimeout(timeoutId);
    }
  }, [aliasText, typing, index, done]);

  // A new alias restarts the animation. Without this the counters only ever
  // grow, so shortening the alias leaves the visible text longer than the
  // value it is supposed to be spelling out — and `done` latches the second
  // branch off, so nothing recovers it.
  useEffect(() => {
    setAlias("");
    setIndex(0);
    setDone(false);
  }, [aliasText]);

  useEffect(() => {
    if (!userConfig.enableTypingAlias) return;

    // `typeAlias` returns the clearTimeout for the step it scheduled;
    // dropping it leaves timers running against a stale index.
    return typeAlias();
  }, [userConfig.enableTypingAlias, typeAlias]);

  useEffect(() => {
    if (userConfig.enableTypingAlias && isMounted) {
      const timeoutId = setTimeout(() => setTyping(true), 300);
      return () => clearTimeout(timeoutId);
    }
  }, [isMounted, userConfig.enableTypingAlias]);

  return (
    <header className="profile mt-2 text-center mb-(--lf-profile-margin-bottom)">
      <Image
        src={userConfig.avatarSrc ?? defaultAvatarIcon}
        alt={userConfig.avatarAlt ?? "Avatar"}
        width={userConfig.avatarSize ?? 120}
        height={userConfig.avatarSize ?? 120}
        className="lf-avatar avatar rounded-full mb-6 mx-auto fade-in"
        style={{ animationDelay: "0.05s" }}
        priority
      />

      <HeadingTag
        className="lf-name fullname fade-in font-(family-name:--lf-name-font-family) text-(length:--lf-name-font-size) font-(--lf-name-font-weight) text-(--lf-name-color)"
        style={{ animationDelay: "0.15s" }}
      >
        {userConfig.fullName ?? "Your Name"}
      </HeadingTag>

      <p
        className="lf-alias alias mt-2 text-base font-semibold fade-in text-(--lf-alias-color)"
        style={{ animationDelay: "0.25s" }}
      >
        {userConfig.enableTypingAlias ? (
          <>
            <span className="sr-only">{aliasText}</span>
            <span
              className={`alias-typing${done ? " alias-typed" : ""}`}
              aria-hidden="true"
            >
              {alias}
            </span>
          </>
        ) : (
          aliasText
        )}
      </p>

      <div
        className="lf-accent-line origin-center reveal-line w-(--lf-accent-line-width) h-0.5 bg-(--lf-accent-line-color) opacity-(--lf-accent-line-opacity) mt-4 mx-auto"
        style={{ animationDelay: "0.35s" }}
        role="presentation"
      />
    </header>
  );
};

export default UserProfile;
