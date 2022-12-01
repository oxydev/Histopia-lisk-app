import {BaseAsset, ApplyAssetContext, ValidateAssetContext} from 'lisk-sdk';

export class DepositAsset extends BaseAsset {
    public name = 'deposit';
    public id = 1;

    // Define schema for asset
    public schema = {
        $id: 'foe/deposit-asset',
        title: 'DepositAsset transaction asset for foe module',
        type: 'object',
        required: [],
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

    public validate({asset}: ValidateAssetContext<{}>): void {
    }

    // eslint-disable-next-line @typescript-eslint/require-await
    public async apply({asset, transaction, stateStore, reducerHandler}: ApplyAssetContext<{}>): Promise<void> {
        let senderAddress = transaction.senderAddress.toString('hex');
        let {tokenIds} = asset;
        for (const tokenId of tokenIds) {
            let nftData = await reducerHandler.invoke('histopianft:getNFTData', {

                nftId: tokenId,
            });
            console.log("DepositAsset.apply", nftData);
            if (nftData === undefined) {
                throw new Error("NFT not found");
            }
            if (nftData.ownerAddress.toString('hex') !== senderAddress) {
                throw new Error("NFT not owned by sender");
            }
            if (nftData.locked === true) {
                throw new Error("NFT is already locked");
            }
        }
    }
}
