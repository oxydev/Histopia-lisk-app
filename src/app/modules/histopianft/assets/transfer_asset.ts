import {BaseAsset, ApplyAssetContext, ValidateAssetContext} from 'lisk-sdk';
import * as NftHandler from "../nftHandler";
import {transferNFTSchema} from "./assetsSchemas";

export class TransferAsset extends BaseAsset {
    public name = 'transfer';
    public id = 3;

    // Define schema for asset
    public schema = transferNFTSchema;

    public validate({asset}: ValidateAssetContext<{}>): void {

    }

    // eslint-disable-next-line @typescript-eslint/require-await
    public async apply({asset, transaction, stateStore}: ApplyAssetContext<{}>): Promise<void> {
        let nftData = await NftHandler.getNFT(stateStore, asset.nftId);

        if (nftData === undefined) {
            throw new Error("NFT not found");
        }
        if (nftData.ownerAddress.toString('hex') !== transaction.senderAddress.toString('hex')) {
            throw new Error("NFT not owned by sender");
        }
        if (nftData.locked === true) {
            throw new Error("NFT is locked");
        }

        nftData.ownerAddress = asset.to;

        await NftHandler.setNFTState(stateStore, nftData.id, nftData);
    }
}
