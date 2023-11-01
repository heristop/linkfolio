import React from "react";
import { LinkFolio } from "@/index";
import userConfig from "./userConfig";

export default function Home() {
  return <LinkFolio userConfig={userConfig} />;
}
