"use client";

import {
  useAppKit,
  useAppKitAccount,
  useDisconnect,
} from "@reown/appkit/react";

export function ConnectButton() {
  const { open } = useAppKit();
  const { disconnect } = useDisconnect();
  const { isConnected } = useAppKitAccount();

  if (!isConnected) {
    return (
      <button
        className="bg-blue-500 text-blue-100 py-2 px-4 rounded-sm transition-colors hover:bg-blue-700"
        onClick={() => open()}
      >
        Connect
      </button>
    );
  }

  return (
    <button
      className="bg-red-500 text-red-100 py-2 px-4 rounded-sm transition-colors hover:bg-red-700"
      onClick={() => disconnect()}
    >
      Disconnect
    </button>
  );
}
