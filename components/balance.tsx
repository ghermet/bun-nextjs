"use client";

import { wagmiConfig } from "@/lib/reown";
import { useAppKitAccount } from "@reown/appkit/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { formatUnits, isHex } from "viem";
import { getBalanceQueryOptions } from "wagmi/query";

function AccountBalance({ address }: { address: `0x${string}` }) {
  const { data: balance } = useSuspenseQuery(
    getBalanceQueryOptions(wagmiConfig, { address }),
  );

  const intlCurrency = Intl.NumberFormat([], {
    style: "currency",
    currency: balance.symbol,
  });

  const value = Number(formatUnits(balance.value, balance.decimals));

  return (
    <h2 className="text-3xl" data-value={balance}>
      {intlCurrency.format(value)}
    </h2>
  );
}

export function Balance() {
  const { address } = useAppKitAccount();

  if (isHex(address)) {
    return (
      <ErrorBoundary
        fallback={
          <h2 className="text-3xl">Something went wrong with your balance</h2>
        }
      >
        <Suspense fallback={<h2 className="text-3xl">Loading balance...</h2>}>
          <AccountBalance address={address} />
        </Suspense>
      </ErrorBoundary>
    );
  }

  return <h2 className="text-3xl">Connect your wallet to see your balance</h2>;
}
