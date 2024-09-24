import React from "react";
import { LinkFolio } from "@/index";
import userConfig from "~/user.config";

export default function Home() {
  return (
    <LinkFolio
      userConfig={userConfig}
      BeforeSocialLinksComponent={() => (
        <div className="mb-8 text-center">
          <h2>Welcome to my page!</h2>
          <p>Check out my social links below:</p>
        </div>
      )}
      AfterSocialLinksComponent={() => (
        <div className="mt-8 text-center">
          <h2>Thanks for visiting!</h2>
          <p>Feel free to connect with me on any platform.</p>
        </div>
      )}
    />
  );
}
