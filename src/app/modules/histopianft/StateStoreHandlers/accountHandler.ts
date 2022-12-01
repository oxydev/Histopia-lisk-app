const { codec } = require("lisk-sdk");
const {
    accountStateSchema,
    CHAIN_STATE_ACCOUNT_PREFIX
} = require("./schemas");

export const getAccountState = async (stateStore, address) => {
    const accountStateBuffer = await stateStore.chain.get(
        `${CHAIN_STATE_ACCOUNT_PREFIX}:${address}`
    );
    if (!accountStateBuffer) {
        return {
            mintedNFTCount: 0,
            ownedNFTCount: 0,
            ownedNFTs: []
        };
    }
    let accountState = codec.decode(
        accountStateSchema,
        accountStateBuffer
    );
    return accountState;
}

export const getAccountStateAsJson = async (dataAccess, account) => {
    const accountStateBuffer = await dataAccess.getChainState(
        `${CHAIN_STATE_ACCOUNT_PREFIX}:${account}`
    );
    if (!accountStateBuffer) {
        return {
            mintedNFTCount: 0,
            ownedNFTCount: 0,
            ownedNFTs: []
        };
    }
    let accountState = codec.decode(
        accountStateSchema,
        accountStateBuffer
    );
    return codec.toJSON(
        accountStateSchema
        ,accountState);
}

export const setAccountState = async (stateStore, address, accountState) => {
    await stateStore.chain.set(
        `${CHAIN_STATE_ACCOUNT_PREFIX}:${address}`,
        codec.encode(accountStateSchema, accountState)
    );
}
