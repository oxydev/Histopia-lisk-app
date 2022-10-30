import {BaseAsset, ApplyAssetContext, ValidateAssetContext} from 'lisk-sdk';
import * as NftHandler from "../nftHandler";
import {destroyNFTSchema} from "./assetsSchemas";

export class DestroyAsset extends BaseAsset {
    public name = 'destroy';
    public id = 2;

    // Define schema for asset
    public schema = destroyNFTSchema

    public validate({asset}: ValidateAssetContext<{}>): void {

    }

    // eslint-disable-next-line @typescript-eslint/require-await
    public async apply({asset, transaction, stateStore}: ApplyAssetContext<{}>): Promise<void> {
        console.log("DestroyAsset.apply", asset, transaction, stateStore);

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

        await NftHandler.deleteNFT(stateStore, nftData.id);
    }
}
