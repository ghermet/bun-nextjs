"use client";

import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { foundry, mainnet, sepolia } from "@reown/appkit/networks";
import {
  cookieStorage,
  CreateConnectorFn,
  createStorage,
  http,
  injected,
} from "@wagmi/core";

// Get projectId from https://dashboard.reown.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) {
  throw new Error("Project ID is not defined");
}

export const networks = [mainnet, sepolia, foundry];

export const connectors: CreateConnectorFn[] = [injected()];

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId,
  networks,
  connectors,
  transports: {
    [foundry.id]: http("http://127.0.0.1:8545"),
  },
});

export const wagmiConfig = wagmiAdapter.wagmiConfig;
