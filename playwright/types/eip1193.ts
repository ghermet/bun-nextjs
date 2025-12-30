import { EIP1193Events } from "viem";
import { MethodName, MethodParameters, MethodReturnType } from "./eip1474";

export type EIP1193RequestFn = (req: {
  method: MethodName;
  params: MethodParameters;
}) => Promise<MethodReturnType>;

export interface EIP1193Provider extends EIP1193Events {
  request: EIP1193RequestFn;
}

export type { EIP1193Events } from "viem";
