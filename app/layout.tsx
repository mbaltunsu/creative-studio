import type { Metadata } from "next";
import { Bricolage_Grotesque, Archivo, Space_Mono } from "next/font/google";
import { MotionConfig } from "motion/react";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Creative Studio — Animation, Motion & AI Production",
  description:
    "A creative production studio for animation, motion graphics, brand films, commercials, editorial imagery, AI-driven production and web design.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${archivo.variable} ${spaceMono.variable} antialiased`}
    >
      <body>
        <MotionConfig reducedMotion="user">
          <SmoothScroll>{children}</SmoothScroll>
        </MotionConfig>
      </body>
    </html>
  );
}
