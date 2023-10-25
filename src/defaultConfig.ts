import {
  blueSkyIcon,
  facebookIcon,
  githubIcon,
  instagramIcon,
  linkedinIcon,
  mastodonIcon,
  snapchatIcon,
  threadsIcon,
  xIcon,
} from "./assets";
import { UserConfigType } from "./types";

const defaultConfig: UserConfigType = {
  socialNetworks: [
    {
      url: "https://",
      iconSrc: xIcon,
      title: "Twitter / X",
      description: "#DevLife #CodeNewbie 🐦",
    },
    {
      url: "https://",
      iconSrc: githubIcon,
      title: "GitHub",
      description: "Versioning my projects 📁",
    },
    {
      url: "https://",
      iconSrc: linkedinIcon,
      title: "LinkedIn",
      description: "Building my professional network. Let's connect! 🌐",
    },
    {
      url: "https://",
      iconSrc: facebookIcon,
      title: "Facebook",
      description: "Sharing life's highlights 🌟🤝",
    },
    {
      url: "https://",
      iconSrc: instagramIcon,
      title: "Instagram",
      description: "Capturing life's frames 📷",
    },
    {
      url: "https://",
      iconSrc: snapchatIcon,
      title: "Snapchat",
      description: "Capturing daily moments 📸",
    },
    {
      url: "https://",
      iconSrc: mastodonIcon,
      title: "Mastodon",
      description: "Sharing without the mainstream noise 🐘",
    },
    {
      url: "https://",
      iconSrc: blueSkyIcon,
      title: "BlueSky",
      description: "Exploring open social web 💙",
    },
    {
      url: "https://",
      iconSrc: threadsIcon,
      title: "Threads",
      description: "Quick updates and stories! 🌀",
    },
  ],
};

export default defaultConfig;