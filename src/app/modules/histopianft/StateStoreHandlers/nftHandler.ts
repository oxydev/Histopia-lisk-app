const { codec } = require("lisk-sdk");
const {
    nftTokenSchema,
    CHAIN_STATE_NFT_PREFIX,
    CHAIN_STATE_SYSTEM,
    systemStateStoreSchema
} = require("./schemas");

export const getSystemState = async (stateStore) => {
    const nftsStateBuffer = await stateStore.chain.get(
        CHAIN_STATE_SYSTEM
    );
    if (!nftsStateBuffer) {
        var buf = Buffer.from('442b6935c96882a40304610284afa29371040bca', 'hex');

        return {
            registeredNFTsCount: 0,
            mintFee: BigInt(2500*10**8),
            ownerAddress: buf,
            registeredTypesCount: 0,
        };
    }
    let nftsState = codec.decode(
        systemStateStoreSchema,
        nftsStateBuffer
    );
    return nftsState;
}

export const getSystemStateAsJson = async (dataAccess) => {
    const nftsStateBuffer = await dataAccess.getChainState(
        CHAIN_STATE_SYSTEM
    );
    if (!nftsStateBuffer) {
        var buf = Buffer.from('442b6935c96882a40304610284afa29371040bca', 'hex');
        return {
            registeredNFTsCount: 0,
            mintFee: 2500*10**8,
            ownerAddress: buf.toString('hex'),
            registeredTypesCount: 0,
        };
    }


    let date =  codec.decode(systemStateStoreSchema,
        nftsStateBuffer
    );

    date.ownerAddress = date.ownerAddress.toString('hex');
    return codec.toJSON(
        systemStateStoreSchema
        ,date);
}

export const getNFT = async (stateStore, nftId) => {
    const nftsState = await getSystemState(stateStore);

    if (nftsState == undefined) {
        throw new Error("No nfts registered");
    }
    if (nftId > nftsState.registeredNFTsCount) {
        throw new Error("invalid nft id "+nftId);
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

export const getNFTAsJson = async (dataAccess, args) => {
    console.log("getNFTAsJson", args);
    const registeredNFTBuffer = await dataAccess.getChainState(
        CHAIN_STATE_NFT_PREFIX + args.nftId
    );
    if (!registeredNFTBuffer) {
        throw new Error("invalid nft id "+args.nftId);
    }
    let data = codec.decode(
        nftTokenSchema,
        registeredNFTBuffer
    );
    data.ownerAddress = data.ownerAddress.toString("hex");
    return codec.toJSON(nftTokenSchema, data);
}

export const setNFTState = async (stateStore,nftId , nftData) => {
    await stateStore.chain.set(
        CHAIN_STATE_NFT_PREFIX + nftId,
        codec.encode(nftTokenSchema, nftData)
    );
}

export const setSystemState = async (stateStore, newTypesState) => {
    await stateStore.chain.set(
        CHAIN_STATE_SYSTEM,
        codec.encode(systemStateStoreSchema, newTypesState)
    );
}

export async function deleteNFT(stateStore, nftId) {
    await stateStore.chain.set(CHAIN_STATE_NFT_PREFIX + nftId, undefined);
}

