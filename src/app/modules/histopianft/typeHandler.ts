
const { codec } = require("lisk-sdk");
const { CHAIN_STATE_NFT_TYPES,typesSchema } = require("./schemas");



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
