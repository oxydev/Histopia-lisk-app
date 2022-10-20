
const { codec } = require("lisk-sdk");
const { CHAIN_STATE_NFT_TYPES,typesSchema , typesStateStoreSchema, CHAIN_STATE_TYPES} = require("./schemas");



export const getTypesState = async (stateStore) => {
    const typesStateBuffer = await  stateStore.chain.get(
        CHAIN_STATE_TYPES
    );
    if (!typesStateBuffer) {
        return {
            registeredTypesCount: 0,
        };
    }
    let typesState = codec.decode(
        typesStateStoreSchema,
        typesStateBuffer
    );
    console.log("typesStateBuffer", typesState);
    return typesState;
}

export const getTypesStateAsJson = async (dataAccess) => {
    const typesStateBuffer = await dataAccess.getChainState(
        CHAIN_STATE_TYPES
    );
    console.log("typesStateBuffer", typesStateBuffer, typesStateStoreSchema, CHAIN_STATE_TYPES , typesSchema);

    if (!typesStateBuffer) {
        return 0;
    }


    const typesState = codec.decode(
        typesStateStoreSchema,
        typesStateBuffer
    );
    console.log("typesStateBuffer", typesState);

    return typesState.registeredTypesCount;
}


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

export const setTypesState = async (stateStore, typesState) => {
    await stateStore.chain.set(
        CHAIN_STATE_TYPES,
        codec.encode(typesStateStoreSchema, typesState)
    );
    return true;
}
