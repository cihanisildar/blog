"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import BreadcrumbNavigation from "@/components/bread-crumb-navigation";
import { SignInButton } from "@clerk/nextjs";
import { ChevronRight } from "lucide-react";

const ClientWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <div className="w-full overflow-y-auto">
      {!isHomePage && (
        <div className="flex items-center  justify-between border-b-slate-200 border-b-[1px]">
          <BreadcrumbNavigation />
          {/* <div className="mr-8">
            <SignInButton>
              <span className="bg-black text-white px-4 py-2 rounded-full flex items-center text-sm cursor-pointer hover:bg-black/90">
                Sign in
                <ChevronRight
                  className="font-bold ml-1"
                  strokeWidth={3}
                  size={16}
                  fontWeight={500}
                />
              </span>
            </SignInButton>
          </div> */}
        </div>
      )}
      {children}
    </div>
  );
};

export default ClientWrapper;