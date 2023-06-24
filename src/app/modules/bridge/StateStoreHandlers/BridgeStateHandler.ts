const { codec } = require("lisk-sdk");
const {
  CHAIN_STATE_NULLS,
  BridgeSystemStateSchema
} = require("./schemas");

export type BridgeState = {
  nullifierHashes: Buffer[],
}

export const getBridgeState = async (stateStore) : Promise<BridgeState>=> {
  const bridgeStateBuffer = await stateStore.chain.get(
    CHAIN_STATE_NULLS
  );
  if (!bridgeStateBuffer) {
    return{
      nullifierHashes: [],
    }
  }
  let bridgeState = codec.decode(
    BridgeSystemStateSchema,
    bridgeStateBuffer
  );
  return bridgeState;
}
export const getBridgeStateAsJson = async (dataAccess): Promise<BridgeState> => {

    const bridgeStateBuffer = await dataAccess.getChainState(
      CHAIN_STATE_NULLS
    );
    if (!bridgeStateBuffer) {
      return{
        nullifierHashes: [],
      }
    }
    let bridgeState = codec.toJSON(
      BridgeSystemStateSchema,
      bridgeStateBuffer
    );
    return bridgeState;
}

export const setBridgeState = async (stateStore, newBridgeState: BridgeState) => {
  await stateStore.chain.set(
    CHAIN_STATE_NULLS,
    codec.encode(BridgeSystemStateSchema, newBridgeState)
  );
}