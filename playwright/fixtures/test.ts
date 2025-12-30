/* eslint-disable react-hooks/rules-of-hooks */
import { test as baseTest } from "@playwright/test";
import { randomUUID } from "node:crypto";
import {
  createTestClient,
  fromHex,
  http,
  isHex,
  PrivateKeyAccount,
  publicActions,
  Transport,
  walletActions,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { Chain, foundry, mainnet, sepolia } from "viem/chains";
import winston, { Logger } from "winston";
import { EIP1193Provider, EIP1193RequestFn } from "../types/eip1193";
import { MethodReturnType } from "../types/eip1474";
import {
  EIP6963Events,
  EIP6963ProviderDetail,
  EIP6963ProviderInfo,
} from "../types/eip6963";

const rpcURL = "http://127.0.0.1:8545" as const;

const account = privateKeyToAccount(
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
);

function createViemClient({
  account,
  chain,
  transport,
}: {
  account: PrivateKeyAccount;
  chain: Chain;
  transport: Transport;
}) {
  return createTestClient({
    account,
    chain,
    transport,
    mode: "anvil",
  })
    .extend(walletActions)
    .extend(publicActions);
}

interface Fixtures {
  baseURL: `http://${string}` | `https://${string}`;
  rpcURL: `http://${string}` | `https://${string}`;
  account: PrivateKeyAccount;
  chain: Chain;
  chains: {
    mainnet: Chain;
    foundry: Chain;
    sepolia: Chain;
  };
  transport: Transport;
  getChain: (chainIdHex?: string) => Chain;
  viemClient: ReturnType<typeof createViemClient>;
  logger: Logger;
  eip1193Request: EIP1193RequestFn;
  announceProvider: void;
}

export const test = baseTest.extend<Fixtures>({
  rpcURL: [rpcURL, { option: true }],
  account: [account, { option: true }],
  chain: [foundry, { option: true }],
  chains: [{ mainnet, foundry, sepolia }, { option: false }],
  transport: [async ({ rpcURL }, use) => use(http(rpcURL)), { option: true }],
  logger: winston.createLogger({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple(),
    ),
    transports: [new winston.transports.Console()],
  }),
  getChain: async ({ chains }, use) => {
    function getChain(chainIdHex?: string) {
      if (!isHex(chainIdHex)) return chains.mainnet;
      const chainId = fromHex(chainIdHex, "number");
      for (const chain of Object.values(chains)) {
        if ("id" in chain && chain.id === chainId) {
          return chain;
        }
      }
      return chains.mainnet;
    }
    await use(getChain);
  },
  viemClient: async ({ account, chain, transport }, use) => {
    await use(createViemClient({ account, chain, transport }));
  },
  eip1193Request: async ({ viemClient, logger, baseURL }, use) => {
    const eip1193Request: EIP1193RequestFn = async (req) => {
      const { method } = req;
      switch (method) {
        case "wallet_requestPermissions":
        case "wallet_revokePermissions":
          return [
            {
              id: randomUUID(),
              date: Date.now(),
              caveats: [],
              invoker: baseURL as `http://${string}`,
              parentCapability: "eth_accounts",
            },
          ] satisfies MethodReturnType;
        case "wallet_getPermissions":
          return [] satisfies MethodReturnType;
        default:
          //@ts-expect-error: Methods mismatch
          const result = await viemClient.request(req);
          logger.info(`[eip1193Request]: ${req.method} -> ${result}`);
          return result;
      }
    };
    await use(eip1193Request);
  },
  announceProvider: [
    async ({ page, eip1193Request }, use) => {
      const uuid = randomUUID();
      await page.exposeFunction("eip1193Request", eip1193Request);
      await page.addInitScript(
        ({ uuid, EIP6963Events }) => {
          function announceProvider() {
            const provider: EIP1193Provider = {
              request: eip1193Request,
              on: () => {},
              removeListener: () => {},
            };

            const info: EIP6963ProviderInfo = {
              uuid,
              name: "Ethereum Wallet",
              icon: "data:image/svg+xml,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22utf-8%22%3F%3E%3C!--Uploaded%20to%3A%20SVG%20Repo%2C%20www.svgrepo.com%2C%20Generator%3A%20SVG%20Repo%20Mixer%20Tools--%3E%3Csvg%20width%3D%22800px%22%20height%3D%22800px%22%20viewBox%3D%220%200%2032%2032%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Ccircle%20cx%3D%2216%22%20cy%3D%2216%22%20r%3D%2216%22%20fill%3D%22%23627EEA%22%2F%3E%3Cg%20fill%3D%22%23FFF%22%20fill-rule%3D%22nonzero%22%3E%3Cpath%20fill-opacity%3D%22.602%22%20d%3D%22M16.498%204v8.87l7.497%203.35z%22%2F%3E%3Cpath%20d%3D%22M16.498%204L9%2016.22l7.498-3.35z%22%2F%3E%3Cpath%20fill-opacity%3D%22.602%22%20d%3D%22M16.498%2021.968v6.027L24%2017.616z%22%2F%3E%3Cpath%20d%3D%22M16.498%2027.995v-6.028L9%2017.616z%22%2F%3E%3Cpath%20fill-opacity%3D%22.2%22%20d%3D%22M16.498%2020.573l7.497-4.353-7.497-3.348z%22%2F%3E%3Cpath%20fill-opacity%3D%22.602%22%20d%3D%22M9%2016.22l7.498%204.353v-7.701z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E",
              rdns: "com.example.ethereum-wallet",
            };

            const announceEvent = new CustomEvent<EIP6963ProviderDetail>(
              EIP6963Events.AnnounceProvider,
              {
                detail: {
                  info,
                  provider,
                },
              },
            );

            window.dispatchEvent(announceEvent);
          }

          window.addEventListener(EIP6963Events.RequestProvider, () => {
            announceProvider();
          });

          announceProvider();
        },
        { uuid, EIP6963Events },
      );

      await use();
    },
    { auto: true },
  ],
});

export { expect } from "@playwright/test";
