import React from "react";
import { LinkFolio } from "@/index";
import userConfig from "./linkfolio.config";

export default function Home() {
  return <LinkFolio userConfig={userConfig} />;
}
