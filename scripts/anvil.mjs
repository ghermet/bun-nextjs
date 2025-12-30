import { spawn } from "node:child_process";

const ls = spawn("anvil", [
  "--fork-url",
  `https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`,
  "--chain-id",
  "31337",
  "--block-time",
  "1",
  "--accounts",
  "10",
  "--balance",
  "10000",
  "--port",
  "8545",
]);

ls.stdout.on("data", (data) => {
  console.log(`${data}`);
});

ls.stderr.on("data", (data) => {
  console.error(`${data}`);
});
