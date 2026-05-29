import type { Metadata } from "next";
import { Geist, Geist_Mono, Permanent_Marker } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const graffiti = Permanent_Marker({
  weight: "400",
  variable: "--font-graffiti",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "a-wall-of-thoughts",
  description: "A public message wall for authenticated users.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${graffiti.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
