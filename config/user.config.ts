import type { UserConfigType } from "@/types";
import {
  blueSkyIcon,
  facebookIcon,
  githubIcon,
  instagramIcon,
  linkedinIcon,
  mastodonIcon,
  snapchatIcon,
  telegramIcon,
  threadsIcon,
  whatsappIcon,
  xIcon,
  youtubeIcon,
} from "@/assets";

/**
 * GA4 measurement id, from the environment rather than hardcoded here.
 *
 * This file ships with the template, so an id committed to it would send
 * every fork's traffic to our property. `NEXT_PUBLIC_` is required: the value
 * has to reach the browser, and this module is imported by client components
 * (`app/demo/TweakPanel.tsx`) as well as by the server.
 *
 * Unset — every fork, and every local `pnpm dev` — leaves `analytics` off, and
 * `<Analytics>` then loads no third-party script at all.
 */
const gaId = process.env.NEXT_PUBLIC_GA_ID;

const userConfig: UserConfigType = {
  siteUrl: "https://linkfolio-demo.vercel.app",
  ...(gaId && { analytics: { provider: "ga", id: gaId } }),
  avatarSrc: "/assets/avatar.webp",
  avatarAlt: "Avatar",
  fullName: "Linkfolio",
  alias: "demo",
  metaTitle: "Linkfolio",
  metaDescription: "A Hub for all your online links 🔗",
  enableTypingAlias: false,
  socialNetworks: [
    {
      url: "#1",
      iconSrc: xIcon,
      title: "Twitter / X",
      description: "🐦 Thoughts in 280 chars",
    },
    {
      url: "#2",
      iconSrc: githubIcon,
      title: "GitHub",
      description: "💻 Code & Collaborate",
      // `span`/`direction` shape the bento layout only; the classic layout
      // ignores both.
      span: "1x2",
    },
    {
      url: "#3",
      iconSrc: linkedinIcon,
      title: "LinkedIn",
      description: "🤝 Professional Network",
    },
    {
      url: "#4",
      iconSrc: facebookIcon,
      title: "Facebook",
      description: "👥 Friends & Updates",
    },
    {
      url: "#5",
      iconSrc: instagramIcon,
      title: "Instagram",
      description: "📸 Life in Pictures",
    },
    {
      url: "#6",
      iconSrc: snapchatIcon,
      title: "Snapchat",
      description: "👻 Fleeting Moments",
    },
    {
      url: "#7",
      iconSrc: whatsappIcon,
      title: "WhatsApp",
      description: "💬 Instant Chats",
    },
    {
      url: "#8",
      iconSrc: telegramIcon,
      title: "Telegram",
      description: "🚀 Swift & Secure",
    },
    {
      url: "#9",
      iconSrc: youtubeIcon,
      title: "YouTube",
      description: "🎥 Watch & Create",
      span: "2x1",
      direction: "horizontal",
    },
    {
      url: "#10",
      iconSrc: threadsIcon,
      title: "Threads",
      description: "🧵 Short Updates",
    },
    {
      url: "#11",
      iconSrc: blueSkyIcon,
      title: "BlueSky",
      description: "🌤️ Open Social Web",
    },
    {
      url: "#12",
      iconSrc: mastodonIcon,
      title: "Mastodon",
      description: "🐘 Decentralized Social",
      group: "socialnetwork",
    },
    {
      url: "#13",
      iconSrc: "/assets/banner-portfolio.png",
      title: "Portfolio",
      description: "Design work and case studies",
      group: "website",
      span: "2x2",
    },
    {
      url: "#14",
      iconSrc: "/assets/banner-cooking.png",
      title: "Cooking Channel",
      description: "Weekly recipes from around the world",
      group: "website",
    },
    {
      url: "#15",
      iconSrc: "/assets/banner-notepad.png",
      title: "Notepad",
      description: "Offline-first markdown note-taking app",
      group: "project",
    },
    {
      url: "#16",
      iconSrc: "/assets/banner-mood.png",
      title: "Mood Tracker",
      description: "Daily mood logging with charts and insights",
      group: "project",
    },
    {
      url: "#17",
      iconSrc: "/assets/banner-splitbill.png",
      title: "Split Bill",
      description: "Expense splitting for groups and roommates",
      group: "project",
      span: "2x1",
    },
  ],
};

export default userConfig;
