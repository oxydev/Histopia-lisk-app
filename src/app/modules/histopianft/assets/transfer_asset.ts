import {BaseAsset, ApplyAssetContext, ValidateAssetContext} from 'lisk-sdk';
import * as NftHandler from "../StateStoreHandlers/nftHandler";
import {transferNFTSchema} from "./assetsSchemas";
import {getAccountState, setAccountState} from "../StateStoreHandlers/accountHandler";

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

        let senderAddress = transaction.senderAddress.toString('hex');

        if (nftData.ownerAddress.toString('hex') !== senderAddress) {
            throw new Error("NFT not owned by sender");
        }
        if (nftData.locked === true) {
            throw new Error("NFT is locked");
        }

        nftData.ownerAddress = asset.to;

        await NftHandler.setNFTState(stateStore, nftData.id, nftData);

        let accountState = await getAccountState(stateStore, senderAddress);
        accountState.ownedNFTCount -= 1;
        accountState.ownedNFTs = accountState.ownedNFTs.filter((nftId) => nftId !== nftData.id);
        await setAccountState(stateStore, senderAddress, accountState);

        console.log("TransferAsset.apply", asset.to, asset.to.toString('hex'));
        accountState = await getAccountState(stateStore, asset.to.toString('hex'));
        accountState.ownedNFTCount += 1;
        accountState.ownedNFTs.push(nftData.id);
        await setAccountState(stateStore, asset.to.toString('hex'), accountState);
    }
}
