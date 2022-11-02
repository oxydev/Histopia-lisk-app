import {BaseAsset, ApplyAssetContext, ValidateAssetContext} from 'lisk-sdk';
import {getSystemState, setSystemState} from "../StateStoreHandlers/nftHandler";

export class SetMintFeeAsset extends BaseAsset {
    public name = 'setMintFee';
    public id = 4;

    // Define schema for asset
    public schema = {
        $id: 'histopianft/setMintFee-asset',
        title: 'SetMintFeeAsset transaction asset for histopianft module',
        type: 'object',
        required: [],
        properties: {
            "mintFee": {
                "dataType": "uint64",
                "fieldNumber": 1
            }
        },
    };

    public validate({asset}: ValidateAssetContext<{}>): void {
        // Validate your asset
    }

    // eslint-disable-next-line @typescript-eslint/require-await
    public async apply({asset, transaction, stateStore}: ApplyAssetContext<{}>): Promise<void> {
        const typesState = await getSystemState(stateStore);
        if (typesState.ownerAddress.toString('hex') !== transaction.senderAddress.toString('hex')) {
            throw new Error('You are not the owner!');
        }
        typesState.mintFee = asset.mintFee;
        await setSystemState(stateStore, typesState);
    }
}
