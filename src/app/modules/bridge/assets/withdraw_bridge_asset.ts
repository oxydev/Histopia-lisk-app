import {BaseAsset, ApplyAssetContext, ValidateAssetContext} from 'lisk-sdk';
import {getBridgeState, setBridgeState} from "../StateStoreHandlers/BridgeStateHandler";
import {getMerkleState, MerkleState} from "../StateStoreHandlers/MerkleStateHandler";
import {BigIntToBuffer, bufferToBigInt} from "./add_commitment_asset";
let vKeyJson = require("./verification_key.json");
import { groth16 } from "snarkjs";


const isKnownRoot = (merkleState: MerkleState, root: Buffer) => {

  if (bufferToBigInt(root) == 0) {
    return false;
  }
  let i = merkleState.currentRootIndex;
  do {
    if (merkleState.roots[i] && bufferToBigInt(merkleState.roots[i]) == bufferToBigInt(root)) {
      return true;
    }
    if (i == 0) {
      i = 100;
    }
    i--;
  }
  while (i != merkleState.currentRootIndex);
  return false;
}
export class WithdrawBridgeAsset extends BaseAsset {
  public name = 'WithdrawBridge';
  public id = 2;

  // Define schema for asset
  public schema = {
    $id: 'bridge/WithdrawBridge-asset',
    title: 'WithdrawBridgeAsset transaction asset for bridge module',
    type: 'object',
    required: ['proof', 'input'],
    properties: {
      proof: {
        fieldNumber: 1,
        dataType: 'string',
      },
      input: {
        fieldNumber: 2,
        dataType: 'string',
      },
      receiver: {
        fieldNumber: 3,
        dataType: 'bytes',
      }
    },
  };

  public validate({asset}: ValidateAssetContext<{}>): void {
    // Validate your asset
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async apply({asset, transaction, stateStore, reducerHandler}: ApplyAssetContext<{}>): Promise<void> {
    const bridgeState = await getBridgeState(stateStore);
    const proof = JSON.parse(asset.proof.replace(/'/g, '"'));
    let publicSignals = JSON.parse(asset.input.replace(/'/g, '"'))
    const nullHash = BigIntToBuffer(BigInt(publicSignals[1]));
    const root = BigIntToBuffer(BigInt(publicSignals[0]));
    const amount = BigInt(publicSignals[2]);

    for (let i = 0; i < bridgeState.nullifierHashes.length; i++) {
      if (bufferToBigInt(bridgeState.nullifierHashes[i]) == bufferToBigInt(nullHash)) {
        throw new Error('You have already withdrawn this commitment!');
      }
    }
    const merkleState = await getMerkleState(stateStore);
    if (!isKnownRoot(merkleState, root)) {
      throw new Error('You have provided an invalid root!');
    }


    if(!(await groth16.verify(vKeyJson, publicSignals, proof))){
      throw new Error('You have provided an invalid proof!');
    }

    bridgeState.nullifierHashes.push(nullHash);

    await setBridgeState(stateStore, bridgeState);

    await reducerHandler.invoke('token:credit', {
      address: asset.receiver,
      amount,
    });
  }
}
