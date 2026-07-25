import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono, Noto_Sans_SC } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const notoSansSC = Noto_Sans_SC({
  variable: "--font-noto-sans-sc",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

export const metadata: Metadata = {
  title: "CloseAI.moe — How Close Are You to AI?",
  description: "测测你与 AI 的亲近程度。一个关于人与 AI 关系的互动测试。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${notoSansSC.variable} h-full antialiased`}
    >
      <body className="h-full overflow-hidden bg-black text-white">
        {children}
      </body>
    </html>
  );
}
