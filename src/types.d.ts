type UserConfigType = {
  avatarSrc?: string | StaticImageData;
  avatarAlt?: string;
  avatarSize?: avatarSize;
  fullName?: string;
  alias?: string;
  metaTitle?: string;
  metaDescription?: string;
  themeColor?: string;
  socialNetworks?: SocialNetwork[];
};

export interface LinkFolioProps {
  userConfig?: UserConfigType;
  additionalContent?: React.ReactNode;
  footerContent?: React.ReactNode;
}

export interface UserProfileProps {
  userConfig: UserConfigType;
}

export interface SocialLinksProps {
  userConfig: UserConfigType;
}

type SocialNetworkType = {
  url: string;
  iconSrc: string | StaticImageData;
  title: string;
  description: string;
};

export interface SocialNetworkProps {
  config: SocialNetwork;
  delay?: number;
}

export interface FooterProps {
  children?: {
    defaultContent?: React.ReactNode;
  };
}
