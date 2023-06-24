const { codec } = require("lisk-sdk");
const {
    CHAIN_STATE_BRIDGE,
    MerkleStateStoreSchema
} = require("./schemas");

export type MerkleState = {
    zeros: Buffer[],
    filledSubtrees: Buffer[],
    currentRootIndex: number,
    nextIndex: number,
    roots: Buffer[],
}

export const getMerkleState = async (stateStore) : Promise<MerkleState>=> {
    const merkleStateBuffer = await stateStore.chain.get(
        CHAIN_STATE_BRIDGE
    );
    if (!merkleStateBuffer) {
        return{
            zeros: [],
            filledSubtrees: [],
            currentRootIndex: 0,
            nextIndex: 0,
            roots: [],
        }
    }
    let merkleState = codec.decode(
        MerkleStateStoreSchema,
        merkleStateBuffer
    );
    return merkleState;
}

export const getMerkleStateAsJson = async (dataAccess): Promise<MerkleState> => {

    const merkleStateBuffer = await dataAccess.getChainState(
        CHAIN_STATE_BRIDGE
    );
    if (!merkleStateBuffer) {
        return{
            zeros: [],
            filledSubtrees: [],
            currentRootIndex: 0,
            nextIndex: 0,
            roots: [],
        }
    }
    let merkleState = codec.toJSON(
        MerkleStateStoreSchema,
        codec.decode(
            MerkleStateStoreSchema,
            merkleStateBuffer
        )
    );
    return merkleState;
}

export const setMerkleState = async (stateStore, newMerkleState: MerkleState) => {
    await stateStore.chain.set(
        CHAIN_STATE_BRIDGE,
        codec.encode(MerkleStateStoreSchema, newMerkleState)
    );
}