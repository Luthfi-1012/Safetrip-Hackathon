import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "SafeTrip — Travel further. Worry less.",
    template: "%s — SafeTrip",
  },
  description: "A demo AI travel planner and protection companion for Indonesian travelers.",
};

export const viewport: Viewport = { themeColor: "#082f38" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-type="software" data-radius="soft" data-buttons="solid" data-motion="on" data-ground="sand" suppressHydrationWarning>
      <head>
        <meta name="page-type" content="software" />
        <meta name="site-kind" content="software" />
        <link rel="stylesheet" href="/assets/motion/motion.css" />
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('m-enter');setTimeout(()=>document.documentElement.classList.add('m-enter-done'),700);document.documentElement.classList.add('mo-js');setTimeout(()=>document.documentElement.classList.add('mo-safe'),2500)" }} />
      </head>
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        {children}
        <Script src="/assets/motion/motion.js" type="module" crossOrigin="anonymous" strategy="afterInteractive" />
        <Script src="/assets/moments/moments.js" type="module" crossOrigin="anonymous" strategy="afterInteractive" />
      </body>
    </html>
  );
}
