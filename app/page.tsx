import { LinkFolio } from "../src";
import userConfig from "./userConfig";

export default function Home() {
  return <LinkFolio userConfig={userConfig} />;
}
