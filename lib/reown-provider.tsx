"use client";

import { wagmiAdapter, projectId } from "@/lib/reown";
import { createAppKit } from "@reown/appkit/react";
import { sepolia, foundry, mainnet } from "@reown/appkit/networks";
import { use, type ReactNode } from "react";
import { cookieToInitialState, WagmiProvider } from "wagmi";

if (!projectId) {
  throw new Error("Project ID is not defined");
}

// Set up metadata
const metadata = {
  name: "appkit-example",
  description: "AppKit Example",
  url: "https://appkitexampleapp.com", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/179229932"],
};

// Create the modal
createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [mainnet, sepolia, foundry],
  defaultNetwork: mainnet,
  metadata: metadata,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
  },
});

export function ReownProvider({
  children,
  cookiesPromise,
}: Readonly<{
  children: ReactNode;
  cookiesPromise: Promise<string | null>;
}>) {
  const cookies = use(cookiesPromise);
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig, cookies);

  return (
    <WagmiProvider
      config={wagmiAdapter.wagmiConfig}
      initialState={initialState}
    >
      {children}
    </WagmiProvider>
  );
}
