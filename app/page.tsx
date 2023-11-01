import React from "react";
import { LinkFolio } from "@/index";
import userConfig from "./user.config";

export default function Home() {
  return <LinkFolio userConfig={userConfig} />;
}
