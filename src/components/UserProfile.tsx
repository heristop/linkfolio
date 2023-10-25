"use client";
import React from "react";
import Image from "next/image";
import { UserProfileProps } from "../types";
import { defaultAvatarIcon } from "../assets";

function UserProfile({ userConfig }: UserProfileProps) {
  const aliasText = userConfig.alias ?? "@your_alias";

  const [isMounted, setIsMounted] = React.useState(false);
  const [typing, setTyping] = React.useState(false);
  const [alias, setAlias] = React.useState("");
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  React.useEffect(() => {
    if (typing && index < aliasText.length) {
      const timeoutId = setTimeout(() => {
        setAlias((prev) => prev + aliasText[index]);
        setIndex((prev) => prev + 1);
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [alias, typing, index]);

  React.useEffect(() => {
    if (isMounted) {
      const timeoutId = setTimeout(() => setTyping(true), 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [isMounted]);

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

      <p className="alias mt-2 text-gray-600 font-semibold">
        <span className="alias-typing">{alias}</span>
      </p>
    </header>
  );
}

export default UserProfile;
