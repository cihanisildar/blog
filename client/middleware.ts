// middleware.ts

import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  // console.log('Request received:', req);
  // Your middleware logic here, e.g., checking authentication, modifying headers, etc.

  // You can return a response if needed
  return NextResponse.next(); // Continue to the next middleware or request handler
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
