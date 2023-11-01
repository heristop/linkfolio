import {
  facebookIcon,
  githubIcon,
  instagramIcon,
  linkedinIcon,
  snapchatIcon,
  xIcon,
} from "./assets";
import { UserConfigType } from "./types";

const defaultConfig: UserConfigType = {
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
  ],
};

export default defaultConfig;
