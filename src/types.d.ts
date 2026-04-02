type UserConfigType = {
  avatarSrc?: string | StaticImageData;
  avatarAlt?: string;
  avatarSize?: avatarSize;
  fullName?: string;
  alias?: string;
  metaTitle?: string;
  metaDescription?: string;
  themeColor?: string;
  enableTypingAlias?: boolean;
  socialNetworks?: SocialNetwork[];
};

export interface LinkFolioProps {
  userConfig?: UserConfigType;
  className?: string;
  UserProfileComponent?: React.ComponentType<UserProfileProps>;
  BeforeSocialLinksComponent?: React.ComponentType;
  SocialLinksComponent?: React.ComponentType<SocialLinksProps>;
  AfterSocialLinksComponent?: React.ComponentType;
  FooterComponent?: React.ComponentType<FooterProps>;
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
  hidden?: boolean;
  group?: string;
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
