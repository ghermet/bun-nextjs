import { EIP1193Provider } from "./eip1193";

export interface EIP6963ProviderInfo {
  uuid: string;
  name: string;
  icon: string;
  rdns: string;
}

export interface EIP6963ProviderDetail {
  info: EIP6963ProviderInfo;
  provider: EIP1193Provider;
}

export interface EIP6963AnnounceProviderEvent extends CustomEvent {
  type: typeof EIP6963Events.AnnounceProvider;
  detail: EIP6963ProviderDetail;
}

export const EIP6963Events = {
  AnnounceProvider: "eip6963:announceProvider",
  RequestProvider: "eip6963:requestProvider",
} as const;

declare global {
  interface WindowEventMap {
    [EIP6963Events.AnnounceProvider]: CustomEvent<EIP6963ProviderDetail>;
    [EIP6963Events.RequestProvider]: CustomEvent;
  }
}
