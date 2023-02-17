import {BaseAsset, ApplyAssetContext, ValidateAssetContext, ReducerHandler} from 'lisk-sdk';
import { getFOEState, setFOEState} from "../StateStoreHandlers/FOEStateHandler";
import {calculateMilitaryPower, sendPreviousReward, updatePool} from "../poolHelper";
import { getFOEAccountState, setAccountState} from "../StateStoreHandlers/FOEAccountHandler";
import {depositSchema} from "./assetsSchemas";


export type AssetData = {
    tokenIds: number[],
}

export class DepositAsset extends BaseAsset {
    public name = 'deposit';
    public id = 1;

    // Define schema for asset
    public schema = depositSchema;



    public validate({}: ValidateAssetContext<AssetData>): void {
    }

    // eslint-disable-next-line @typescript-eslint/require-await
    public async apply({asset, transaction, stateStore, reducerHandler}: ApplyAssetContext<AssetData>): Promise<void> {
        let timestamp = stateStore.chain.lastBlockHeaders[0].timestamp;
        let FOEState = await getFOEState(stateStore);
        let updatedFoeState = await updatePool(FOEState, timestamp);
        console.log("updatedFoeState", updatedFoeState);
        
        let senderAddress = transaction.senderAddress.toString('hex');

        let userFoeAccountState = await getFOEAccountState(stateStore, senderAddress);
        if (userFoeAccountState === undefined) {
            throw new Error('User does not have an account');
        }
        console.log("test reach this point  1 ");
        
        await sendPreviousReward(userFoeAccountState, updatedFoeState, reducerHandler, senderAddress);

        let {tokenIds} = asset;
        let depositingMilitaryPower =  await this.lockDepositedNFTsAndCalculateAddedMilitaryPower(tokenIds, reducerHandler, senderAddress);
        console.log("test reach this point  2 ", depositingMilitaryPower, userFoeAccountState.militaryPowerAtWar);

        userFoeAccountState.militaryPowerAtWar += Number(depositingMilitaryPower);
        console.log("test reach this point  3 ");

        updatedFoeState.histopianCount += Number(tokenIds.length);
        console.log("test reach this point  4 ");

        updatedFoeState.totalMilitaryPowerAtWar += Number(depositingMilitaryPower);
        console.log("test reach this point  5 ", userFoeAccountState.rewardDebt);

        userFoeAccountState.rewardDebt = Number(userFoeAccountState.militaryPowerAtWar * updatedFoeState.generalAccEraPerShare / 10 ** 12);
        console.log("test reach this point  6 ", typeof(updatedFoeState.eraPerSecond), typeof(updatedFoeState.generalAccEraPerShare), typeof(updatedFoeState.histopianCount), typeof(updatedFoeState.lastRewardTime), typeof(updatedFoeState.totalMilitaryPowerAtWar));

        // await setAccountState(stateStore, senderAddress, userFoeAccountState);
        await setFOEState(stateStore, updatedFoeState);
    }

    private async lockDepositedNFTsAndCalculateAddedMilitaryPower(tokenIds: number[], reducerHandler: ReducerHandler, senderAddress: string) : Promise<number>{
        let depositingMilitaryPower = 0;
        for (const tokenId of tokenIds) {
            let nftData = await reducerHandler.invoke<{
                ownerAddress: Buffer;
                locked: boolean;
            }>('histopianft:getNFTData', {
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
                locked: true,
            });
            if (!isLocked) {
                throw new Error("NFT could not be locked");
            }
        }
        return depositingMilitaryPower;
    }


}


