const { codec } = require("lisk-sdk");
const {
    CHAIN_STATE_FOE,
    FOEStateStoreSchema
} = require("./schemas");

export type FOEState = {
    totalMilitaryPowerAtWar: number,
    eraPerSecond: number,
    lastRewardTime: number,
    generalAccEraPerShare: number,
    histopianCount: number,
}

export const getFOEState = async (stateStore) : Promise<FOEState>=> {
    const FOEStateBuffer = await stateStore.chain.get(
        CHAIN_STATE_FOE
    );
    if (!FOEStateBuffer) {
        return{
            totalMilitaryPowerAtWar: 0,
            eraPerSecond: 100000000,
            lastRewardTime: 0,
            generalAccEraPerShare: 0,
            histopianCount: 0,
        }
    }
    let foeState = codec.decode(
        FOEStateStoreSchema,
        FOEStateBuffer
    );
    return foeState;
}

export const getFOEStateAsJson = async (dataAccess): Promise<FOEState> => {
    const foeStateBuffer = await dataAccess.getChainState(
        CHAIN_STATE_FOE
    );
    if (!foeStateBuffer) {
        return{
            totalMilitaryPowerAtWar: 0,
            eraPerSecond: 100000000,
            lastRewardTime: 0,
            generalAccEraPerShare: 0,
            histopianCount: 0,
        }
    }


    let foeState =  codec.decode(FOEStateStoreSchema,
        foeStateBuffer
    );

    return codec.toJSON(
        FOEStateStoreSchema
        ,foeState);
}

export const setFOEState = async (stateStore, newFOEState: FOEState) => {
    await stateStore.chain.set(
        CHAIN_STATE_FOE,
        codec.encode(FOEStateStoreSchema, newFOEState)
    );
}
