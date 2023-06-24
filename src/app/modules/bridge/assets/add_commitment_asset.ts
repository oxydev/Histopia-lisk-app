import {BaseAsset, ApplyAssetContext, ValidateAssetContext} from 'lisk-sdk';
import {getSystemState} from "../../histopianft/StateStoreHandlers/nftHandler";
import {getMerkleState, setMerkleState} from "../StateStoreHandlers/MerkleStateHandler";
import {toBigIntBE, toBigIntLE, toBufferLE} from 'bigint-buffer';
import { log } from 'console';

const circomlib = require("circomlib");
const mimcsponge = circomlib.mimcsponge;

export function hashLeftRight(left: bigint, right: bigint): bigint {

  return BigInt("0x" + mimcsponge.multiHash([left % 21888242871839275222246405745257275088548364400416034343698204186575808495617n, right % 21888242871839275222246405745257275088548364400416034343698204186575808495617n]).toString(16)) % 21888242871839275222246405745257275088548364400416034343698204186575808495617n
}

export const bufferToBigInt = (buf: Buffer): bigint => {
  const reversed = Buffer.from(buf);
  reversed.reverse();
  const hex = reversed.toString("hex");
  if (hex.length === 0) {
    return BigInt(0);
  }
  return BigInt(`0x${hex}`);
}
export const BigIntToBuffer = (num: bigint): Buffer => {
  return toBufferLE(num, 32)
}

export class AddCommitmentAsset extends BaseAsset {
  public name = 'AddCommitment';
  public id = 1;

  // Define schema for asset
  public schema = {
    $id: 'bridge/AddCommitment-asset',
    title: 'AddCommitmentAsset transaction asset for bridge module',
    type: 'object',
    required: ['commitment'],
    properties: {
      commitment: {
        fieldNumber: 1,
        dataType: 'bytes',
      }
    },
  };

  public validate({asset}: ValidateAssetContext<{}>): void {
    // Validate your asset
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async apply({asset, transaction, stateStore}: ApplyAssetContext<{}>): Promise<void> {
    const typesState = await getSystemState(stateStore);
    // if (typesState.ownerAddress.toString('hex') !== transaction.senderAddress.toString('hex')) {
    //   throw new Error('You are not the owner!');
    // }

    const merkleState = await getMerkleState(stateStore);
    if (merkleState.zeros.length == 0) {
      // construct merkle tree
      let currentZero = 21663839004416932945382355908790599225266501822907911457504978515578255421292n;
      // convert bigint to hex

      merkleState.zeros.push(BigIntToBuffer(currentZero));
      merkleState.filledSubtrees.push(BigIntToBuffer(currentZero));
      for (let i = 1; i < 20; i++) {
        currentZero = hashLeftRight(currentZero, currentZero);
        merkleState.zeros.push(BigIntToBuffer(currentZero));
        merkleState.filledSubtrees.push(BigIntToBuffer(currentZero));
      }
      merkleState.roots.push(BigIntToBuffer(hashLeftRight(currentZero, currentZero)));
      for (let i = 0; i < 99; i++) {
        merkleState.roots.push(BigIntToBuffer(BigInt(0)));
      }
    }
    let commitment = asset.commitment;
    commitment = toBigIntBE(commitment);
    console.log(commitment);
    console.log(asset);

    let currentIndex = merkleState.nextIndex;
    merkleState.nextIndex += 1;
    let currentLevelHash = commitment;
    let left;
    let right;
    for (let i = 0; i < 20; i++) {
      if (currentIndex % 2 == 0) {
        left = currentLevelHash;
        right = bufferToBigInt(merkleState.zeros[i])
        merkleState.filledSubtrees[i] = BigIntToBuffer(currentLevelHash)
      } else {
        left = bufferToBigInt(merkleState.filledSubtrees[i])
        right = currentLevelHash;
      }


      currentLevelHash = hashLeftRight(left, right);
      currentIndex = Math.floor(currentIndex / 2);
    }
    merkleState.currentRootIndex = (merkleState.currentRootIndex + 1) % 100;
    merkleState.roots[merkleState.currentRootIndex] = BigIntToBuffer(currentLevelHash);
    setMerkleState(stateStore, merkleState)
    // emit merkleState.nextIndex - 1
  }
}
