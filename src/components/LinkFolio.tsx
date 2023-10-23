import Footer from "./Footer";
import SocialLinks from "./SocialLinks";
import UserProfile from "./UserProfile";
import { LinkFolioProps } from "../types";
import defaultConfig from "../defaultConfig";

function LinkFolio({
  userConfig,
  additionalContent,
  footerContent,
}: LinkFolioProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-10 md:p-16 lg:px-15% lg:py-10 max-w-screen-lg mx-auto font-roboto">
      <UserProfile userConfig={userConfig || defaultConfig} />

      <SocialLinks userConfig={userConfig || defaultConfig} />

      {additionalContent ? additionalContent : null}

      <Footer>{{ defaultContent: footerContent }}</Footer>
    </div>
  );
}

export default LinkFolio;
