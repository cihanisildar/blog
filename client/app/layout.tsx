import ClientWrapper from "@/components/client-wrapper";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { SidebarLayout } from "../components/sidebar-layout";
import "./globals.css";

const font = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Chain's Dev Blog",
  description: "Exploring the world of code, one commit at a time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${font.className} h-full`}>
        <div className="h-full w-full dark:bg-black bg-white dark:bg-dot-white/[0.2] relative flex">
          <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black"></div>
          <SidebarLayout>
            <ClientWrapper>{children}</ClientWrapper>
          </SidebarLayout>
        </div>
      </body>
    </html>
  );
}