import { EIP1474Methods } from "viem";

export type EIP1474Method = EIP1474Methods[number];
export type MethodName = EIP1474Method["Method"];
export type MethodParameters = EIP1474Method["Parameters"];
export type MethodReturnType = EIP1474Method["ReturnType"];

export type { EIP1474Methods } from "viem";
