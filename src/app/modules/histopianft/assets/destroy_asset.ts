import {BaseAsset, ApplyAssetContext, ValidateAssetContext} from 'lisk-sdk';
import * as NftHandler from "../StateStoreHandlers/nftHandler";
import {destroyNFTSchema} from "./assetsSchemas";
import {getAccountState, setAccountState} from "../StateStoreHandlers/accountHandler";

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
        let senderAddress = transaction.senderAddress.toString('hex');

        if (nftData === undefined) {
            throw new Error("NFT not found");
        }
        if (nftData.ownerAddress.toString('hex') !== senderAddress) {
            throw new Error("NFT not owned by sender");
        }
        if (nftData.locked === true) {
            throw new Error("NFT is locked");
        }

        await NftHandler.deleteNFT(stateStore, nftData.id);

        let accountState = await getAccountState(stateStore, senderAddress);
        accountState.ownedNFTCount -= 1;
        accountState.ownedNFTs = accountState.ownedNFTs.filter((nftId) => nftId !== nftData.id);
        await setAccountState(stateStore, senderAddress, accountState);
    }
}
