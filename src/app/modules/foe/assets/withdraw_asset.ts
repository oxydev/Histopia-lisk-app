import {BaseAsset, ApplyAssetContext, ValidateAssetContext, ReducerHandler} from 'lisk-sdk';
import {getFOEState, setFOEState} from "../StateStoreHandlers/FOEStateHandler";
import {calculateMilitaryPower, sendPreviousReward, updatePool} from "../poolHelper";
import {getFOEAccountState, setAccountState} from "../StateStoreHandlers/FOEAccountHandler";

export type AssetData = {
    tokenIds: number[],
}

export class WithdrawAsset extends BaseAsset {
    public name = 'withdraw';
    public id = 2;

    // Define schema for asset
    public schema = {
        $id: 'foe/withdraw-asset',
        title: 'WithdrawAsset transaction asset for foe module',
        type: 'object',
        required: ['tokenIds'],
        properties: {
            tokenIds: {
                fieldNumber: 1,
                type: 'array',
                items: {
                    dataType: 'uint32',
                }
            }
        },
    };

    public validate({asset}: ValidateAssetContext<AssetData>): void {
        // Validate your asset
    }

    // eslint-disable-next-line @typescript-eslint/require-await
    public async apply({asset, transaction, stateStore, reducerHandler}: ApplyAssetContext<AssetData>): Promise<void> {
        let timestamp = stateStore.chain.lastBlockHeaders[0].timestamp;
        let FOEState = await getFOEState(stateStore);
        let updatedFoeState = await updatePool(FOEState, timestamp);

        let senderAddress = transaction.senderAddress.toString('hex');

        let userFoeAccountState = await getFOEAccountState(stateStore, senderAddress);
        if (userFoeAccountState === undefined) {
            throw new Error('User does not have an account');
        }

        await sendPreviousReward(userFoeAccountState, updatedFoeState, reducerHandler, senderAddress);

        let {tokenIds} = asset;
        let depositingMilitaryPower = await this.unlockDepositedNFTsAndCalculateReducedMilitaryPower(tokenIds, reducerHandler, senderAddress);

        userFoeAccountState.militaryPowerAtWar -= depositingMilitaryPower;
        updatedFoeState.histopianCount -= tokenIds.length;
        updatedFoeState.totalMilitaryPowerAtWar -= depositingMilitaryPower;
        userFoeAccountState.rewardDebt = userFoeAccountState.militaryPowerAtWar * updatedFoeState.generalAccEraPerShare / 10 ** 12;
        await setAccountState(stateStore, senderAddress, userFoeAccountState);
        await setFOEState(stateStore, updatedFoeState);
    }

    private async unlockDepositedNFTsAndCalculateReducedMilitaryPower(tokenIds: number[], reducerHandler: ReducerHandler, senderAddress: string) : Promise<number>{
        let depositingMilitaryPower = 0;
        for (const tokenId of tokenIds) {
            let nftData = await reducerHandler.invoke('histopianft:getNFTData', {
                nftId: tokenId,
            });
            if (nftData === undefined) {
                throw new Error("NFT not found");
            }
            if (nftData.ownerAddress.toString('hex') !== senderAddress) {
                throw new Error("NFT not owned by sender");
            }
            if (nftData.locked === true) {
                throw new Error("NFT is already locked");
            }
            depositingMilitaryPower += calculateMilitaryPower(nftData);
            let isLocked = await reducerHandler.invoke('histopianft:setNFTLockState', {
                nftId: tokenId,
                locked: false,
            });
            if (!isLocked) {
                throw new Error("NFT could not be locked");
            }
        }
        return depositingMilitaryPower;
    }
}
