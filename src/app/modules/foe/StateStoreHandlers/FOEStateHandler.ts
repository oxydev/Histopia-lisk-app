const { codec } = require("lisk-sdk");
const {
    CHAIN_STATE_FOE,
    FOEStateStoreSchema
} = require("./schemas");

export const getFOEState = async (stateStore) => {
    const FOEStateBuffer = await stateStore.chain.get(
        CHAIN_STATE_FOE
    );
    if (!FOEStateBuffer) {
        return{
            totalMilitaryPowerAtWar: 0,
            eraPerSecond: 100000000,
            lastRewardTime: 0,
            generalAccEraPerShare: 0,
        }
    }
    let foeState = codec.decode(
        FOEStateStoreSchema,
        FOEStateBuffer
    );
    return foeState;
}

export const getFOEStateAsJson = async (dataAccess) => {
    const foeStateBuffer = await dataAccess.getChainState(
        CHAIN_STATE_FOE
    );
    if (!foeStateBuffer) {
        return{
            totalMilitaryPowerAtWar: 0,
            eraPerSecond: 100000000,
            lastRewardTime: 0,
            generalAccEraPerShare: 0,
        }
    }


    let foeState =  codec.decode(FOEStateStoreSchema,
        foeStateBuffer
    );

    return codec.toJSON(
        FOEStateStoreSchema
        ,foeState);
}

export const setFOEState = async (stateStore, newFOEState) => {
    await stateStore.chain.set(
        CHAIN_STATE_FOE,
        codec.encode(FOEStateStoreSchema, newFOEState)
    );
}
