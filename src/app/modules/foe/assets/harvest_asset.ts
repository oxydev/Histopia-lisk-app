import {BaseAsset, ApplyAssetContext, ValidateAssetContext} from 'lisk-sdk';
import {getFOEState, setFOEState} from "../StateStoreHandlers/FOEStateHandler";
import {sendPreviousReward, updatePool} from "../poolHelper";
import {getFOEAccountState, setAccountState} from "../StateStoreHandlers/FOEAccountHandler";

export class HarvestAsset extends BaseAsset {
    public name = 'harvest';
    public id = 3;

    // Define schema for asset
    public schema = {
        $id: 'foe/harvest-asset',
        title: 'HarvestAsset transaction asset for foe module',
        type: 'object',
        required: [],
        properties: {},
    };

    public validate({asset}: ValidateAssetContext<{}>): void {
        // Validate your asset
    }

    // eslint-disable-next-line @typescript-eslint/require-await
    public async apply({asset, transaction, stateStore, reducerHandler}: ApplyAssetContext<{}>): Promise<void> {
        let timestamp = stateStore.chain.lastBlockHeaders[0].timestamp;
        let FOEState = await getFOEState(stateStore);
        let updatedFoeState = await updatePool(FOEState, timestamp);

        let senderAddress = transaction.senderAddress.toString('hex');

        let userFoeAccountState = await getFOEAccountState(stateStore, senderAddress);
        if (userFoeAccountState === undefined) {
            throw new Error('User does not have an account');
        }

        await sendPreviousReward(userFoeAccountState, updatedFoeState, reducerHandler, senderAddress);

        userFoeAccountState.rewardDebt = userFoeAccountState.militaryPowerAtWar * updatedFoeState.generalAccEraPerShare / 10 ** 12;
        await setAccountState(stateStore, senderAddress, userFoeAccountState);
        await setFOEState(stateStore, updatedFoeState);
    }
}
