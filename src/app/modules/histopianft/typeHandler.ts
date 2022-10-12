
const { codec, cryptography } = require("lisk-sdk");
const { CHAIN_STATE_NFT_TYPES,typesSchema ,typeSchema} = require("./schemas");



export const getAllTypes = async (stateStore) => {
    const registeredTypesBuffer = await stateStore.chain.get(
        CHAIN_STATE_NFT_TYPES
    );
    if (!registeredTypesBuffer) {
        return [];
    }

    return codec.decode(
        typesSchema,
        registeredTypesBuffer
    );
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

export const getType = async (stateStore, typeId) => {
    const registeredTypesBuffer = await stateStore.chain.get(
        CHAIN_STATE_NFT_TYPES+":"+typeId
    );
    if (!registeredTypesBuffer) {
        return [];
    }

    const registeredTokens = codec.decode(
        typeSchema,
        registeredTypesBuffer
    );

    return registeredTokens.registeredTypes;
}

export const addNewType = async (stateStore, type) => {
    await stateStore.chain.set(
        CHAIN_STATE_NFT_TYPES+":"+type.id,
        codec.encode(typesSchema, type)
    );
}
