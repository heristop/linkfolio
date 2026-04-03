import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import userConfig from "../config/user.config";

export const alt = userConfig.fullName ?? "Linkfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const description = userConfig.metaDescription?.replaceAll(/\p{Emoji_Presentation}/gu, "").trim();

export default function OGImage() {
  const avatarBuffer = readFileSync(
    join(process.cwd(), "public/assets/avatar-og.png"),
  );
  const avatarSrc = `data:image/png;base64,${avatarBuffer.toString("base64")}`;

  const primary = userConfig.themeColor ?? "#2f5d62";

  return new ImageResponse(
    (
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
            padding: "48px 64px",
            boxShadow: "0 4px 24px -6px rgba(0,0,0,0.08)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={avatarSrc}
            alt=""
            width={120}
            height={120}
            style={{ borderRadius: "50%", marginBottom: 24 }}
          />
          <div style={{ display: "flex", fontSize: 48, fontWeight: 600, color: primary }}>
            {userConfig.fullName}
          </div>
          {userConfig.alias && (
            <div style={{ display: "flex", fontSize: 24, color: "#525252", marginTop: 8 }}>
              {`@${userConfig.alias}`}
            </div>
          )}
          <div
            style={{
              display: "flex",
              width: 48,
              height: 2,
              background: primary,
              opacity: 0.3,
              marginTop: 20,
              borderRadius: 1,
            }}
          />
          {description && (
            <div
              style={{
                display: "flex",
                fontSize: 22,
                color: "#525252",
                marginTop: 16,
              }}
            >
              {description}
            </div>
          )}
        </div>
      </div>
    ),
    { ...size },
  );
}
