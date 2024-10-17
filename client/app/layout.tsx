import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { SidebarLayout } from "../components/sidebar-layout";
import { ClerkProvider } from "@clerk/nextjs";
import ClientWrapper from "@/components/client-wrapper";

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
    <ClerkProvider>
      <html lang="en">
        <body className={font.className}>
          <div className="w-full dark:bg-black bg-white dark:bg-dot-white/[0.2] relative flex items-center justify-center">
            <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black"></div>
            <SidebarLayout>
              <ClientWrapper>{children}</ClientWrapper>
            </SidebarLayout>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
