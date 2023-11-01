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
  metaTitle: "LinkFolio",
  metaDescription: "A hub for all your online links 🔗",
  socialNetworks: [
    {
      url: "#",
      iconSrc: xIcon,
      title: "Twitter / X",
      description: "#DevLife #CodeNewbie 🐦",
    },
    {
      url: "#",
      iconSrc: githubIcon,
      title: "GitHub",
      description: "Versioning my projects 📁",
    },
    {
      url: "#",
      iconSrc: linkedinIcon,
      title: "LinkedIn",
      description: "Building my professional network. Let's connect! 🌐",
    },
    {
      url: "#",
      iconSrc: facebookIcon,
      title: "Facebook",
      description: "Sharing life's highlights 🌟🤝",
    },
    {
      url: "#",
      iconSrc: instagramIcon,
      title: "Instagram",
      description: "Capturing life's frames 📷",
    },
    {
      url: "#",
      iconSrc: snapchatIcon,
      title: "Snapchat",
      description: "Capturing daily moments 📸",
    },
    {
      url: "#",
      iconSrc: whatsappIcon,
      title: "WhatsApp",
      description: "Simple, reliable messaging and calling 🟢",
    },
    {
      url: "#",
      iconSrc: telegramIcon,
      title: "Telegram",
      description: "Messaging focusing on speed and security 🚀",
    },
    {
      url: "#",
      iconSrc: youtubeIcon,
      title: "YouTube",
      description: "Discover, watch, and share your passion 🎥",
    },
    {
      url: "#",
      iconSrc: mastodonIcon,
      title: "Mastodon",
      description: "Sharing without the mainstream noise 🐘",
    },
    {
      url: "#",
      iconSrc: blueSkyIcon,
      title: "BlueSky",
      description: "Exploring open social web 💙",
    },
    {
      url: "#",
      iconSrc: threadsIcon,
      title: "Threads",
      description: "Quick updates and stories! 🌀",
    },
  ],
};

export default userConfig;
