import { Address } from "@/components/address";
import { ConnectButton } from "@/components/connect-button";
import { Balance } from "../components/balance";

export default function Home() {
  return (
    <main className="flex w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
      <section>
        <Balance />
        <Address />
      </section>
      <br />
      <ConnectButton />
    </main>
  );
}
