import {StateStore} from "lisk-sdk";
const {codec} = require("lisk-sdk");
const {
    typesStateStoreSchema,
    CHAIN_STATE_TYPES,
    CHAIN_STATE_TYPE_PREFIX,
    typeSchema
} = require("./schemas");

export const getTypesState = async (stateStore) => {
    const typesStateBuffer = await stateStore.chain.get(
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
    if (!typesStateBuffer) {
        return 0;
    }

    const typesState = codec.decode(typesStateStoreSchema,
        typesStateBuffer
    );
    // console.log("typesStateBuffer", typesState);

    return typesState.registeredTypesCount;
}

export const getType = async (stateStore, typeId) => {
    const typesState = await getTypesState(stateStore);
    // console.log("getting type", typeId, CHAIN_STATE_TYPE_PREFIX, typeSchema);

    if (typesState == undefined) {
        throw new Error("No types registered");
    }
    if (typeId > typesState.registeredTypesCount) {
        throw new Error("invalid type id "+typeId);
    }
    const registeredTypeBuffer = await stateStore.chain.get(
        CHAIN_STATE_TYPE_PREFIX + typeId
    );
    if (!registeredTypeBuffer) {
        return undefined;
    }
    return codec.decode(
        typeSchema,
        registeredTypeBuffer
    );
}

export const getTypeAsJson = async (dataAccess, args) => {
    const typesState = await getTypesStateAsJson(dataAccess);
    // console.log("getting type", args.typeId, CHAIN_STATE_TYPE_PREFIX, typeSchema);

    if (typesState == undefined) {
        throw new Error("No types registered");
    }
    if (args.typeId > typesState.registeredTypesCount) {
        throw new Error("invalid type id "+args.typeId);
    }
    const registeredTypeBuffer = await dataAccess.getChainState(
        CHAIN_STATE_TYPE_PREFIX + args.typeId
    );
    if (!registeredTypeBuffer) {
        throw new Error("No type registered with id "+args.typeId);
    }
    // console.log("registeredTypeBuffer", registeredTypeBuffer);
    return codec.toJSON(
        typeSchema,
        codec.decode(
            typeSchema,
            registeredTypeBuffer
        ));
}

export const addNewType = async (stateStore, typeId, typeObject) => {
    await stateStore.chain.set(
        CHAIN_STATE_TYPE_PREFIX + typeId,
        codec.encode(typeSchema, typeObject)
    );
    return true;
}

export const setTypesState = async (stateStore: StateStore, typesState: any) => {
    console.log("setTypesState", typesState, typesStateStoreSchema, CHAIN_STATE_TYPES);
    await stateStore.chain.set(
        CHAIN_STATE_TYPES,
        codec.encode(typesStateStoreSchema, typesState)
    );
    return true;
}
