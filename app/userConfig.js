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
} from "../src/assets";

const userConfig = {
  avatarSrc: "/assets/avatar.webp",
  avatarAlt: "Avatar",
  fullName: "Your Name",
  alias: "@your_alias",
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
