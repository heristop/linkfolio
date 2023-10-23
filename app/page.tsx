import { LinkFolio } from "linkfolio";
import userConfig from "./userConfig";

export default function Home() {
  return <LinkFolio userConfig={userConfig} />;
}
