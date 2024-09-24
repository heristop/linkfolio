import { UserConfigType } from "@/types";
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

const userConfig: UserConfigType = {
  avatarSrc: "/assets/avatar.webp",
  avatarAlt: "Avatar",
  fullName: "Your Name",
  alias: "@your_alias",
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
      group: "opensource",
      hidden: false,
    },
  ],
};

export default userConfig;
