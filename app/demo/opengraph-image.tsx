import { OG_SIZE, avatarCard, avatarCardAlt } from "../lib/ogCards";

export const alt = avatarCardAlt;
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OGImage() {
  return avatarCard();
}
