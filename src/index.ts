import LinkFolio from "./components/LinkFolio";
import UserProfile from "./components/UserProfile";
import SocialLinks from "./components/SocialLinks";
import Footer from "./components/Footer";
import Analytics from "./components/Analytics";
import ThemeProvider from "./components/ThemeProvider";
import ThemeToggle from "./components/ThemeToggle";
import ShareButton from "./components/ShareButton";
import QrCodeButton from "./components/QrCodeButton";

export type {
  ThemeColors,
  UserConfigType,
  SocialNetworkType,
  LayoutMode,
  BentoSpan,
  BentoDirection,
  AnalyticsAdapter,
  AnalyticsConfig,
  AnalyticsEvent,
  AnalyticsProviderName,
  AnalyticsScript,
} from "./types";
export type { ThemePreset, ThemePresetKey } from "./themes";
export { THEME_PRESETS, THEME_PRESET_KEYS } from "./themes";
export {
  LinkFolio,
  UserProfile,
  SocialLinks,
  Footer,
  Analytics,
  ThemeProvider,
  ThemeToggle,
  ShareButton,
  QrCodeButton,
};
export {
  LINKFOLIO_ANALYTICS_EVENT,
  LINK_CLICK_EVENT,
  buildLinkClickEvent,
  emitAnalyticsEvent,
} from "./lib/analytics";
export {
  registerAnalyticsAdapter,
  resolveAnalyticsAdapter,
} from "./lib/analytics-adapters";
