import type { Metadata } from "next";
import { LinkFolio } from "@/index";
import userConfig from "~/user.config";
import { deployLayout, isShowcase, pageMetadata } from "./lib/siteMeta";
import LandingPage, { PAGE_DESCRIPTION, PAGE_TITLE } from "./lib/LandingPage";

/**
 * In profile mode the empty object defers entirely to the root layout's
 * `buildMetadata(userConfig)` — title, description, canonical and Open Graph
 * all describe the person, which is exactly right for a personal deployment.
 */
export const metadata: Metadata = isShowcase
  ? pageMetadata({
      title: PAGE_TITLE,
      description: PAGE_DESCRIPTION,
      path: "/",
    })
  : {};

/**
 * The template's two lives share this route: the project's own deployment
 * (LINKFOLIO_SHOWCASE=1) markets Linkfolio here, while a fork's deployment —
 * the default — is the person's actual link-in-bio page, matching the shape
 * of the reference app heristop/my-linkfolio.
 */
export default function Home() {
  return isShowcase ? (
    <LandingPage />
  ) : (
    <LinkFolio userConfig={{ ...userConfig, layout: deployLayout }} />
  );
}
