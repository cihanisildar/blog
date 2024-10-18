"use client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { CiHashtag } from "react-icons/ci";
import { MdAccountCircle, MdDashboard } from "react-icons/md";
import feather_logo from "../public/feather_4015682.png";
import swan_logo from "../public/origami_2722241.png";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/sidebar";

export function SidebarLayout({ children }: { children: React.ReactNode }) {
  const links = [
    {
      label: "Blog",
      href: "/posts",
      icon: (
        <MdDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Tags",
      href: "/tags",
      icon: (
        <CiHashtag className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "About",
      href: "/about",
      icon: (
        <MdAccountCircle className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];
  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-transparent dark:bg-neutral-800 w-full flex-1 border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? (
              <Logo />
            ) : (
              <div className="border-b-slate-200 border-b-[1px]">
                <LogoIcon />
              </div>
            )}
            <div className="p-4 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink
                  key={idx}
                  link={link}
                  onClick={() => setOpen(false)} // Close sidebar on link click
                />
              ))}
            </div>
          </div>
          <div className="p-4">
            <SidebarLink
              link={{
                label: "Cihan IŞILDAR",
                href: "/about",
                icon: (
                  <Image
                    src={feather_logo}
                    className="h-7 w-7 flex-shrink-0 rounded-full"
                    width={30}
                    height={30}
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      {children}
    </div>
  );
}
export const Logo = () => {
  return (
    <Link
      href="/"
      className="font-normal border-b-slate-200 border-b-[1px] flex gap-2 items-center text-sm text-black p-4 relative z-20"
    >
      <Image
        src={swan_logo}
        className="flex-shrink-0 rounded-full"
        width={20}
        height={20}
        alt="Avatar"
      />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-semibold text-black dark:text-white whitespace-pre"
      >
        BLOGCHAIN
      </motion.span>
    </Link>
  );
};
export const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="font-normal p-4 flex space-x-2 items-center text-sm text-black relative z-20"
    >
      <Image
        src={swan_logo}
        className="flex-shrink-0 rounded-full"
        width={20}
        height={20}
        alt="Avatar"
      />{" "}
    </Link>
  );
};
