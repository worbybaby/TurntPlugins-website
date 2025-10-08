import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";
import "./globals.css";

const pressStart = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  display: 'block',
});

export const metadata: Metadata = {
  title: "Turnt Plugins - Retro Audio Plugin Store",
  description: "Browse and download creative audio plugins with a retro Windows 2.0 aesthetic",
  openGraph: {
    title: "Turnt Plugins - Retro Audio Plugin Store",
    description: "Browse and download creative audio plugins with a retro Windows 2.0 aesthetic",
    url: "https://turntplugins.com",
    siteName: "Turnt Plugins",
    images: [
      {
        url: "/og-image.png", // We'll need to create this
        width: 1200,
        height: 630,
        alt: "Turnt Plugins - Retro Audio Plugin Store",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Turnt Plugins - Retro Audio Plugin Store",
    description: "Browse and download creative audio plugins with a retro Windows 2.0 aesthetic",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased ${pressStart.className}`}>
        {children}
      </body>
    </html>
  );
}
