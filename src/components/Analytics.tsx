// components/AnalyticsLoader.tsx
'use client';
import Script from 'next/script';

export default function Analytics({id, url}:{id?:string, url?:string}) {
  if (id === undefined || url === undefined) {
    return null;
  }

  return (
    <Script
      defer
      src="/stats/script.js"
      data-website-id={id}
      data-host-url={url}
      />
  );
}