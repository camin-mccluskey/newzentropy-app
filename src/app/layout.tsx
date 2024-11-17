import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: "Maximum Entropy News",
  description: "A news aggregator that uses maximum entropy to rank articles. Created by Camin McCluskey.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <NuqsAdapter>
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
