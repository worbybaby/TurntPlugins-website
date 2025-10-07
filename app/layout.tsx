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
