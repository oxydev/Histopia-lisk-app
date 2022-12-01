const { codec } = require("lisk-sdk");
const {
    CHAIN_STATE_ACCOUNT_FOE_PREFIX,
    FOEAccountStateSchema
} = require("./schemas");

export type FOEAccountState = {
    militaryPowerAtWar: number,
    rewardDebt: number,
}

export const getFOEAccountState = async (stateStore, address): Promise<FOEAccountState> => {
    const accountStateBuffer = await stateStore.chain.get(
        `${CHAIN_STATE_ACCOUNT_FOE_PREFIX}${address}`
    );
    if (!accountStateBuffer) {
        return {
            militaryPowerAtWar: 0,
            rewardDebt: 0,
        };
    }
    return codec.decode(
        FOEAccountStateSchema,
        accountStateBuffer
    );
}

export const getFOEAccountStateAsJson = async (dataAccess, address) => {
    if (!address) {
        return {
            militaryPowerAtWar: 0,
            rewardDebt: 0,
        };
    }
    const accountStateBuffer = await dataAccess.getChainState(
        `${CHAIN_STATE_ACCOUNT_FOE_PREFIX}${address}`
    );
    if (!accountStateBuffer) {
        return {
            militaryPowerAtWar: 0,
            rewardDebt: 0,
        };
    }
    let accountState = codec.decode(
        FOEAccountStateSchema,
        accountStateBuffer
    );
    return codec.toJSON(
        FOEAccountStateSchema
        ,accountState);
}

export const setAccountState = async (stateStore, address, accountState) => {
    await stateStore.chain.set(
        `${CHAIN_STATE_ACCOUNT_FOE_PREFIX}${address}`,
        codec.encode(FOEAccountStateSchema, accountState)
    );
}
