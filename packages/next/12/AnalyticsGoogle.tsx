"use client";

import { useRouter } from "next/router";
import Script from "next/script";
import { useEffect, useState } from "react";
import { gtagPageview } from "@koine/browser";

export type AnalyticsGoogleProps = {
  /** Falls back to `.env` variable `NEXT_PUBLIC_GTM_ID` */
  id?: string;
};

export let AnalyticsGoogle = ({ id }: AnalyticsGoogleProps) => {
  const uid = id || process.env["NEXT_PUBLIC_GTM_ID"];
  const { events, asPath, query } = useRouter();
  const [ready, setReady] = useState(false);
  const [routed, setRouted] = useState(false);
  // const [url, setUrl] = useState("");

  useEffect(() => {
    const handleRouteChange = () => {
      setRouted(true);
    };
    events.on("routeChangeComplete", handleRouteChange);

    return () => {
      events.off("routeChangeComplete", handleRouteChange);
    };
  }, [events]);

  useEffect(() => {
    if (routed && ready && asPath) {
      // const search = query;
      gtagPageview(asPath);
    }
  }, [asPath, query, routed, ready]);

  if (!uid) {
    return null;
  }

  return (
    <>
      <Script
        id="google-tagmanager"
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
        onLoad={() => setReady(true)}
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${id}', { 'send_page_view': false });
        `}
      </Script>
    </>
  );
};

export default AnalyticsGoogle;
