export type ThemeColors = {
  "color-primary"?: string;
  "color-secondary"?: string;
  "color-background-start"?: string;
  "color-background-end"?: string;
  "lf-card-bg"?: string;
  "lf-card-shadow"?: string;
  "lf-card-border"?: string;
  "lf-name-color"?: string;
  "lf-alias-color"?: string;
  "lf-network-hover-bg"?: string;
  "lf-description-color"?: string;
  "lf-accent-line-color"?: string;
  "lf-accent-line-opacity"?: string;
  "lf-button-opacity"?: string;
};

type UserConfigType = {
  avatarSrc?: string | StaticImageData;
  avatarAlt?: string;
  avatarSize?: avatarSize;
  fullName?: string;
  alias?: string;
  metaTitle?: string;
  metaDescription?: string;
  themeColor?: string;
  theme?: ThemeColors;
  darkTheme?: ThemeColors;
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
