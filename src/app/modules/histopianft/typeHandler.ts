const {codec} = require("lisk-sdk");
import * as Schemas from "./schemas";


export const getTypesState = async (stateStore) => {
    const typesStateBuffer = stateStore.chain.get(
        Schemas.CHAIN_STATE_TYPES
    );
    if (!typesStateBuffer) {
        return {
            registeredTypesCount: 10,
        };
    }
     let typesState = codec.decode(
        Schemas.typesStateStoreSchema,
        typesStateBuffer
    );
    console.log("typesStateBuffer", typesState);
    return typesState;
}

export const getTypesStateAsJson = async (dataAccess) => {
    const typesStateBuffer = dataAccess.getChainState(
        Schemas.CHAIN_STATE_TYPES
    );
    if (!typesStateBuffer) {
        return 100;
    }

    const typesState = codec.decode(
        Schemas.typesStateStoreSchema,
        typesStateBuffer
    );
    console.log("typesStateBuffer", typesState);

    return typesState.registeredTypesCount;
}


export const getType = async (stateStore, typeId) => {
    const typesState = await getTypesState(stateStore);
    if (!typesState) {
        return undefined;
    }
    if (typeId > typesState.registeredTypesCount) {
        return undefined;
    }
    const registeredTypeBuffer = await stateStore.chain.get(
        Schemas.CHAIN_STATE_TYPE_PREFIX + typeId
    );
    if (!registeredTypeBuffer) {
        return undefined;
    }
    return codec.decode(
        Schemas.typeSchema,
        registeredTypeBuffer
    );
}

export const getTypeAsJson = async (dataAccess, typeId) => {
    const typesState = await getTypesStateAsJson(dataAccess);
    if (!typesState) {
        return undefined;
    }
    if (typeId > typesState.registeredTypesCount) {
        return undefined;
    }
    const registeredTypeBuffer = await dataAccess.getChainState(
        Schemas.CHAIN_STATE_TYPE_PREFIX + typeId
    );
    if (!registeredTypeBuffer) {
        return undefined;
    }
    return codec.toJSON(
        Schemas.typeSchema,
        codec.decode(
            Schemas.typeSchema,
            registeredTypeBuffer
        ));
}

export const addNewType = async (stateStore, typeId, typeObject) => {
    const typesState = await getTypesState(stateStore);
    if (!typesState) {
        return undefined;
    }
    if (typeId > typesState.registeredTypesCount) {
        throw new Error("Type ID is too high");
    }
    await stateStore.chain.set(
        Schemas.CHAIN_STATE_TYPE_PREFIX + typeId,
        codec.encode(Schemas.typeSchema, typeObject)
    );
    typesState.registeredTypesCount += 1;
    // delete typesState.registeredTypesCount;
    let x = {
        registeredTypesCount: typesState.registeredTypesCount,
    }
    await stateStore.chain.set(
        Schemas.CHAIN_STATE_TYPES,
        codec.encode(Schemas.typesStateStoreSchema, x)
    );
    console.log("typesStateBuffer", typesState, codec.encode(Schemas.typesStateStoreSchema, x));
    return true;
}
