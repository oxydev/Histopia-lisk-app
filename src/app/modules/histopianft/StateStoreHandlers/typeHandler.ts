const {codec} = require("lisk-sdk");
const {
    CHAIN_STATE_TYPE_PREFIX,
    typeSchema
} = require("./schemas");
import {getSystemState, getSystemStateAsJson} from "./nftHandler";

export const getType = async (stateStore, typeId) => {
    const typesState = await getSystemState(stateStore);
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

export const getTypeAsJson = async (dataAccess, typeId) => {
    const typesState = await getSystemStateAsJson(dataAccess);
    // console.log("getting type", args.typeId, CHAIN_STATE_TYPE_PREFIX, typeSchema);

    if (typesState == undefined) {
        throw new Error("No types registered");
    }
    if (typeId > typesState.registeredTypesCount) {
        throw new Error("invalid type id "+typeId);
    }
    const registeredTypeBuffer = await dataAccess.getChainState(
        CHAIN_STATE_TYPE_PREFIX + typeId
    );
    if (!registeredTypeBuffer) {
        throw new Error("No type registered with id "+typeId);
    }
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
