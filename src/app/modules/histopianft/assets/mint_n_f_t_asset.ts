import {BaseAsset, ApplyAssetContext, ValidateAssetContext} from 'lisk-sdk';
import * as TypeHandler from "../typeHandler";
import * as NftHandler from "../nftHandler";
import {mintNFTSchema} from "./assetsSchemas";

export class MintNFTAsset extends BaseAsset {
    public name = 'mintNFT';
    public id = 1;

    // Define schema for asset
    public schema = mintNFTSchema

    public validate({asset}: ValidateAssetContext<{}>): void {
        // Validate your asset
    }

    // eslint-disable-next-line @typescript-eslint/require-await
    public async apply({asset, transaction, stateStore}: ApplyAssetContext<{}>): Promise<void> {
        let nftsState = await NftHandler.getNFTsState(stateStore);

        let nftProperties = await this.generateNftProperties(stateStore, asset.typeId);

        console.log('mint nft ', nftsState.registeredNFTsCount + 1);
        const nftObject = {
            id: nftsState.registeredNFTsCount + 1,
            typeId: asset.typeId,
            ownerAddress: asset.to,
            nftProperties: nftProperties,
            locked: false
        };

        await NftHandler.setNFTState(stateStore,  nftObject.id, nftObject);
        nftsState.registeredNFTsCount += 1;
        await NftHandler.setNFTsState(stateStore, nftsState);
    }

    private async generateNftProperties(stateStore, typeId) {
        let type = await TypeHandler.getType(stateStore, typeId);
        if (type === undefined) {
            throw new Error("Type not found");
        }
        let nftProperties = [];
        for (let i = 0; i < type.nftProperties.length; i++) {
            let property = type.nftProperties[i];
            nftProperties.push({
                name: property.name,
                amount: Math.floor(Math.random() * (property.maximum - property.minimum + 1)) + property.minimum
            })
        }
        return nftProperties;
    }
}
