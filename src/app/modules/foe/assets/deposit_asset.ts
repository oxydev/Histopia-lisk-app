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
        
        let senderAddress = transaction.senderAddress.toString('hex');

        let userFoeAccountState = await getFOEAccountState(stateStore, senderAddress);
        if (userFoeAccountState === undefined) {
            throw new Error('User does not have an account');
        }
        

        await sendPreviousReward(userFoeAccountState, updatedFoeState, reducerHandler, transaction.senderAddress);


        let {tokenIds} = asset;
        let depositingMilitaryPower =  await this.lockDepositedNFTsAndCalculateAddedMilitaryPower(tokenIds, reducerHandler, senderAddress);
        userFoeAccountState.militaryPowerAtWar += Number(depositingMilitaryPower);
        updatedFoeState.histopianCount += Number(tokenIds.length);
        updatedFoeState.totalMilitaryPowerAtWar += Number(depositingMilitaryPower);

        userFoeAccountState.rewardDebt = BigInt(BigInt(userFoeAccountState.militaryPowerAtWar) * updatedFoeState.generalAccEraPerShare / BigInt(10 ** 5));

        await setAccountState(stateStore, senderAddress, userFoeAccountState);
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


