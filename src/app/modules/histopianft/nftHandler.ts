const { codec } = require("lisk-sdk");
const {
    nftTokenSchema,
    CHAIN_STATE_NFTS,
    CHAIN_STATE_NFT_PREFIX,
    nftsStateStoreSchema
} = require("./schemas");

export const getNFTsState = async (stateStore) => {
    const nftsStateBuffer = await stateStore.chain.get(
        CHAIN_STATE_NFTS
    );
    if (!nftsStateBuffer) {
        return {
            registeredNFTsCount: 0,
        };
    }
    let nftsState = codec.decode(
        nftsStateStoreSchema,
        nftsStateBuffer
    );
    console.log("nftsStateBuffer", nftsState);
    return nftsState;
}

export const getNFTsStateAsJson = async (dataAccess) => {
    console.log("getNFTsStateAsJson", CHAIN_STATE_NFTS);
    const nftsStateBuffer = await dataAccess.getChainState(
        CHAIN_STATE_NFTS
    );
    console.log("nftsStateBuffer", nftsStateBuffer);
    if (!nftsStateBuffer) {
        return 100;
    }

    const nftsState = codec.decode(nftsStateStoreSchema,
        nftsStateBuffer
    );
    // console.log("nftsStateBuffer", nftsState);

    return nftsState.registeredNFTsCount;
}

export const getNFT = async (stateStore, nftId) => {
    const nftsState = await getNFTsState(stateStore);
    // console.log("getting type", typeId, CHAIN_STATE_TYPE_PREFIX, typeSchema);

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
    const nftsState = await getNFTsStateAsJson(dataAccess);
    // console.log("getting type", typeId, CHAIN_STATE_TYPE_PREFIX, typeSchema);

    if (nftsState == undefined) {
        throw new Error("No nfts registered");
    }
    if (args.nftId > nftsState.registeredNFTsCount) {
        throw new Error("invalid nft id "+args.nftId);
    }
    const registeredNFTBuffer = await dataAccess.getChainState(
        CHAIN_STATE_NFT_PREFIX + args.nftId
    );
    if (!registeredNFTBuffer) {
        return undefined;
    }
    return codec.decode(
        nftTokenSchema,
        registeredNFTBuffer
    );
}

export const addNewNFT = async (stateStore, newNFT) => {
    await stateStore.chain.set(
        CHAIN_STATE_NFT_PREFIX + newNFT.id,
        codec.encode(nftTokenSchema, newNFT)
    );
}

export const setNftState = async (stateStore, newTypesState) => {
    console.log("setNftState", newTypesState);
    console.log("setNftState", CHAIN_STATE_NFTS);
    console.log("setNftState", nftsStateStoreSchema);
    await stateStore.chain.set(
        CHAIN_STATE_NFTS,
        codec.encode(nftsStateStoreSchema, newTypesState)
    );
}
