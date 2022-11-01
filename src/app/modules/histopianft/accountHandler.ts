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
        };
    }
    let accountState = codec.decode(
        accountStateSchema,
        accountStateBuffer
    );
    return accountState;
}

export const getAccountStateAsJson = async (dataAccess, address) => {
    if (!address || !address.address) {
        return {
            mintedNFTCount: 0,
            ownedNFTCount: 0,
        };
    }
    let account  = address.address;
    const accountStateBuffer = await dataAccess.getChainState(
        `${CHAIN_STATE_ACCOUNT_PREFIX}:${account}`
    );
    console.log("accountStateBuffer", accountStateBuffer, address, account);
    if (!accountStateBuffer) {
        return {
            mintedNFTCount: 0,
            ownedNFTCount: 0,
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
    console.log("setAccountState", address, accountState);
    await stateStore.chain.set(
        `${CHAIN_STATE_ACCOUNT_PREFIX}:${address}`,
        codec.encode(accountStateSchema, accountState)
    );
}
