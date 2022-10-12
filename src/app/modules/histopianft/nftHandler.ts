const { codec } = require("lisk-sdk");
const { CHAIN_STATE_NFT_TOKENS, nftTokensSchema } = require("./schemas");

// const CHAIN_STATE_NFT_TOKENS = "nft:registeredNFTTokens";
// const CHAIN_STATE_NFT_TYPES = "nft:registeredNFTTypes";


export const getAllNFTs = async (stateStore) => {
    const registeredNFTsBuffer = await stateStore.chain.get(
        CHAIN_STATE_NFT_TOKENS
    );
    if (!registeredNFTsBuffer) {
        return [];
    }

    const registeredTokens = codec.decode(
        nftTokensSchema,
        registeredNFTsBuffer
    );

    return registeredTokens.registeredNFTTokens;
}


export const getAllNFTsAsJSON = async (dataAccess) => {
    const registeredNFTsBuffer = await dataAccess.getChainState(
        CHAIN_STATE_NFT_TOKENS
    );

    if (!registeredNFTsBuffer) {
        return [];
    }

    const registeredTokens = codec.decode(
        nftTokensSchema,
        registeredNFTsBuffer
    );

     return codec.toJSON(nftTokensSchema, registeredTokens)
        .registeredNFTTokens;
};

export const setAllNfts = async (stateStore, nfts) => {
    const registeredNfts = {
        registeredTypes: nfts.sort((a, b) => a.id > b.id),
    };

    await stateStore.chain.set(
        CHAIN_STATE_NFT_TOKENS,
        codec.encode(nftTokensSchema, registeredNfts)
    );
}
