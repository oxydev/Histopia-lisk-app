
const { codec, cryptography } = require("lisk-sdk");
const { CHAIN_STATE_NFT_TYPES,typesSchema } = require("./schemas");



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

    return registeredTokens.registeredTypes;
}


export const getAllTypesAsJSON = async (dataAccess) => {
    console.log("getAllTypesAsJSON");
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
        .registeredTypes;
};

export const setAllTypes = async (stateStore, types) => {
    console.log("setAllTypes", types);
    const registeredTypes = {
        registeredTypes: types.sort((a, b) => a.id > b.id),
    };

    await stateStore.chain.set(
        CHAIN_STATE_NFT_TYPES,
        codec.encode(typesSchema, registeredTypes)
    );
}
