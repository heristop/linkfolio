"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { UserProfileProps } from "../types";
import { defaultAvatarIcon } from "../assets";

let aliasText = "";

const UserProfile = ({ userConfig }: UserProfileProps) => {
  aliasText = userConfig.alias ?? "@your_alias";

  const [isMounted, setIsMounted] = useState(false);
  const [typing, setTyping] = useState(false);
  const [alias, setAlias] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (false === userConfig.enableTypingAlias) {
      return;
    }

    if (typing && index < aliasText.length) {
      const timeoutId = setTimeout(() => {
        setAlias((prev: string) => prev + aliasText[index]);
        setIndex((prev: number) => prev + 1);
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [alias, typing, index, userConfig.enableTypingAlias]);

  useEffect(() => {
    if (false === userConfig.enableTypingAlias) {
      return;
    }

    if (isMounted) {
      const timeoutId = setTimeout(() => setTyping(true), 300);

      return () => clearTimeout(timeoutId);
    }
  }, [isMounted, userConfig.enableTypingAlias]);

  return (
    <header className="profile mb-12 text-center">
      <Image
        src={userConfig.avatarSrc ?? defaultAvatarIcon}
        alt={userConfig.avatarAlt ?? "Avatar"}
        width={userConfig.avatarSize ?? 120}
        height={userConfig.avatarSize ?? 120}
        className="avatar rounded-full mb-4 mx-auto shadow-lg glitter-effect"
        priority={true}
      />

      <h1 className="fullname text-2xl font-semibold">
        {(userConfig.fullName ??= "Your Name")}
      </h1>

      <p className="alias mt-2 text-base text-gray-600 font-semibold">
        {userConfig.enableTypingAlias ? (
          <>
            <span className="alias-typing">{alias}</span>
          </>
        ) : (
          aliasText
        )}
      </p>
    </header>
  );
};

export default UserProfile;
