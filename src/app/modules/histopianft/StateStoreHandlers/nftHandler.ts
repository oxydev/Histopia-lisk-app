const {codec} = require("lisk-sdk");
const {
    nftTokenSchema,
    CHAIN_STATE_NFT_PREFIX,
    CHAIN_STATE_SYSTEM,
    systemStateStoreSchema
} = require("./schemas");

export const getSystemState = async (stateStore) => {
    const systemStateBuffer = await stateStore.chain.get(
        CHAIN_STATE_SYSTEM
    );
    if (!systemStateBuffer) {
        var buf = Buffer.from('442b6935c96882a40304610284afa29371040bca', 'hex');

        return {
            registeredNFTsCount: 0,
            mintFee: BigInt(2500 * 10 ** 8),
            ownerAddress: buf,
            registeredTypesCount: 0,
        };
    }
    let systemState = codec.decode(
        systemStateStoreSchema,
        systemStateBuffer
    );
    return systemState;
}

export const getSystemStateAsJson = async (dataAccess) => {
    const systemStateBuffer = await dataAccess.getChainState(
        CHAIN_STATE_SYSTEM
    );
    if (!systemStateBuffer) {
        var buf = Buffer.from('442b6935c96882a40304610284afa29371040bca', 'hex');
        return {
            registeredNFTsCount: 0,
            mintFee: 2500 * 10 ** 8,
            ownerAddress: buf.toString('hex'),
            registeredTypesCount: 0,
        };
    }


    let systemState = codec.decode(
        systemStateStoreSchema,
        systemStateBuffer
    );

    systemState.ownerAddress = systemState.ownerAddress.toString('hex');
    return codec.toJSON(
        systemStateStoreSchema
        , systemState
    );
}

export const getNFT = async (stateStore, nftId) => {
    const nftsState = await getSystemState(stateStore);

    if (nftsState == undefined) {
        throw new Error("No nfts registered");
    }
    if (nftId > nftsState.registeredNFTsCount) {
        throw new Error("invalid nft id " + nftId);
    }
    const registeredNFTBuffer = await stateStore.chain.get(
        CHAIN_STATE_NFT_PREFIX + nftId
    );
    if (!registeredNFTBuffer) {
        return undefined;
    }
    return codec.decode(
        nftTokenSchema,
        registeredNFTBuffer
    );
}

export const getNFTAsJson = async (dataAccess, nftId) => {
    const registeredNFTBuffer = await dataAccess.getChainState(
        CHAIN_STATE_NFT_PREFIX + nftId
    );
    if (!registeredNFTBuffer) {
        throw new Error("invalid nft id " + nftId);
    }
    let data = codec.decode(
        nftTokenSchema,
        registeredNFTBuffer
    );
    data.ownerAddress = data.ownerAddress.toString("hex");
    return codec.toJSON(nftTokenSchema, data);
}

export const setNFTState = async (stateStore, nftData) => {
    await stateStore.chain.set(
        CHAIN_STATE_NFT_PREFIX + nftData.id,
        codec.encode(nftTokenSchema, nftData)
    );
}

export const setSystemState = async (stateStore, newSystemState) => {
    await stateStore.chain.set(
        CHAIN_STATE_SYSTEM,
        codec.encode(systemStateStoreSchema, newSystemState)
    );
}

export async function deleteNFT(stateStore, nftId) {
    await stateStore.chain.set(CHAIN_STATE_NFT_PREFIX + nftId, undefined);
}

