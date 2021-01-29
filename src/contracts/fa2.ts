import {
  Contract,
  OperationOptions,
  FA2TransferParams,
  FA2UpdateOperatorsParams,
} from "../types";
import { fromOpOpts } from "../helpers";

export function transfer(
  fa2: Contract,
  transfers: FA2TransferParams[],
  opts?: OperationOptions
) {
  return fa2.methods
    .transfer(
      optimizeTransfersFrom(transfers).map(([from, txs]) => ({
        from_: from,
        txs: txs.map(({ tokenId, to, value }) => ({
          token_id: tokenId,
          to_: to,
          amount: value,
        })),
      }))
    )
    .toTransferParams(fromOpOpts(undefined, opts));
}

export function updateOperators(
  fa2: Contract,
  updates: FA2UpdateOperatorsParams[],
  opts?: OperationOptions
) {
  return fa2.methods
    .update_operators(
      updates.map(({ type, tokenId, from, to }) => ({
        [type]: {
          token_id: tokenId,
          owner: from,
          operator: to,
        },
      }))
    )
    .toTransferParams(fromOpOpts(undefined, opts));
}

function optimizeTransfersFrom(transfers: FA2TransferParams[]) {
  const tMap = new Map<string, [Omit<FA2TransferParams, "from">]>();
  for (const { from, ...rest } of transfers) {
    if (tMap.has(from)) {
      tMap.get(from)!.push(rest);
    } else {
      tMap.set(from, [rest]);
    }
  }
  return Array.from(tMap);
}
