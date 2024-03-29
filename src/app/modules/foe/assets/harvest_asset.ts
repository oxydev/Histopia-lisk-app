import {BaseAsset, ApplyAssetContext, ValidateAssetContext} from 'lisk-sdk';
import {getFOEState, setFOEState} from "../StateStoreHandlers/FOEStateHandler";
import {sendPreviousReward, updatePool} from "../poolHelper";
import {getFOEAccountState, setAccountState} from "../StateStoreHandlers/FOEAccountHandler";
import {harvestSchema} from "./assetsSchemas";

export class HarvestAsset extends BaseAsset {
    public name = 'harvest';
    public id = 3;

    // Define schema for asset
    public schema = harvestSchema;

    public validate({}: ValidateAssetContext<{}>): void {
        // Validate your asset
    }

    // eslint-disable-next-line @typescript-eslint/require-await
    public async apply({transaction, stateStore, reducerHandler}: ApplyAssetContext<{}>): Promise<void> {
        try {
            let timestamp = stateStore.chain.lastBlockHeaders[0].timestamp;
            let FOEState = await getFOEState(stateStore);
            let updatedFoeState = await updatePool(FOEState, timestamp);

            let senderAddress = transaction.senderAddress.toString('hex');

            let userFoeAccountState = await getFOEAccountState(stateStore, senderAddress);
            if (userFoeAccountState === undefined) {
                throw new Error('User does not have an account');
            }

            await sendPreviousReward(userFoeAccountState, updatedFoeState, reducerHandler, transaction.senderAddress);


            userFoeAccountState.rewardDebt = BigInt(BigInt(userFoeAccountState.militaryPowerAtWar) * BigInt(updatedFoeState.generalAccEraPerShare) / BigInt(10 ** 5));

            
            await setAccountState(stateStore, senderAddress, userFoeAccountState);
            await setFOEState(stateStore, updatedFoeState);
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
}
