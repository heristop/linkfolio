"use client";
import React from "react";
import Image from "next/image";
import type { UserProfileProps } from "../types";
import { defaultAvatarIcon } from "../assets";
import { useTypedAlias } from "../lib/useTypedAlias";

const UserProfile: React.FC<UserProfileProps> = ({
  userConfig,
  headingLevel,
}) => {
  const aliasText = userConfig.alias;
  const HeadingTag = headingLevel ?? "h1";

  const { alias, done } = useTypedAlias(
    aliasText,
    userConfig.enableTypingAlias,
  );

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
