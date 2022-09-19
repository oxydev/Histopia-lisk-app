
const { codec, cryptography } = require("lisk-sdk");

export const getAllTypes = async (stateStore) => {
    const registeredTypesBuffer = await stateStore.chain.get(
        CHAIN_STATE_NFT_TYPES
    );
    if (!registeredTypesBuffer) {
        return [];
    }

    const registeredTokens = codec.decode(
        typesSchema,
        registeredTypesBuffer
    );

    return registeredTokens.registeredNFTTokens;
}


export const getAllTypesAsJSON = async (dataAccess) => {
    const registeredTypesBuffer = await dataAccess.getChainState(
        CHAIN_STATE_NFT_TYPES
    );

    if (!registeredTypesBuffer) {
        return [];
    }

    const registeredTokens = codec.decode(
        typesSchema,
        registeredTypesBuffer
    );

    return codec.toJSON(typesSchema, registeredTokens)
        .registeredNFTTokens;
};

export const setAllTypes = async (stateStore, types) => {
    const registeredTypes = {
        registeredTypes: types.sort((a, b) => a.id.compare(b.id)),
    };
    
    await stateStore.chain.set(
        CHAIN_STATE_NFT_TYPES,
        codec.encode(typesSchema, registeredTypes)
    );
}