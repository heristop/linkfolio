import { ImageResponse } from "next/og";
import userConfig from "../config/user.config";
import { OG_SIZE, avatarCard, avatarCardAlt } from "./lib/ogCards";
import { isShowcase } from "./lib/siteMeta";

/**
 * Showcase mode advertises the project; a personal deployment advertises the
 * person, with the same avatar card /demo uses in showcase mode.
 */
export const alt = isShowcase
  ? "Linkfolio — open-source, self-hosted link-in-bio page"
  : avatarCardAlt;
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OGImage() {
  if (!isShowcase) return avatarCard();

  const primary = userConfig.themeColor ?? "#2f5d62";

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to bottom, #d9e2e1, #f2f7f6)",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          background: "#f5f5f5",
          borderRadius: 12,
          padding: "56px 80px",
          boxShadow: "0 4px 24px -6px rgba(0,0,0,0.08)",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 64,
            fontWeight: 700,
            color: primary,
            letterSpacing: -1,
          }}
        >
          Linkfolio
        </div>
        <div
          style={{
            display: "flex",
            width: 64,
            height: 3,
            background: primary,
            opacity: 0.3,
            marginTop: 24,
            borderRadius: 1.5,
          }}
        />
        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: "#525252",
            marginTop: 24,
            textAlign: "center",
          }}
        >
          Open-source, self-hosted link-in-bio page
        </div>
      </div>
    </div>,
    { ...OG_SIZE },
  );
}
