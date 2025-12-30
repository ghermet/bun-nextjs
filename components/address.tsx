"use client";

import { useAppKitAccount } from "@reown/appkit/react";

export function Address() {
	const { address } = useAppKitAccount();
	return <h1 className="text-2xl">{address}</h1>;
}
