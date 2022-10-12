import {BaseAsset, ApplyAssetContext, ValidateAssetContext} from 'lisk-sdk';
import {getAllTypes, setAllTypes} from "../typeHandler";
import {getAllNFTs} from "../nftHandler";

export class MintNFTAsset extends BaseAsset {
    public name = 'mintNFT';
    public id = 1;

    // Define schema for asset
    public schema = {
        $id: 'histopianft/mintNFT-asset',
        title: 'MintNFTAsset transaction asset for histopianft module',
        type: 'object',
        required: [],
        properties: {
            to: {
                dataType: 'bytes',
                fieldNumber: 1,
            },
            typeId: {
                dataType: 'uint32',
                fieldNumber: 2,
            }
        },
    };

    public validate({asset}: ValidateAssetContext<{}>): void {

    }

    // eslint-disable-next-line @typescript-eslint/require-await
    public async apply({asset, transaction, stateStore}: ApplyAssetContext<{}>): Promise<void> {
        const allNfts = await getAllNFTs(stateStore);
        // throw new Error('Not implemented.');
        let typeObject = await stateStore.chain.get(`nftType:${asset.typeId}`);

        const nftObject = {
            id: allNfts.length + 1,
            nftProperties: asset.nftProperties,
            name: asset.name,
            maxSupply: asset.maxSupply,
            allowedAccessorTypes: asset.allowedAccessorTypes,
        };
        allTypes.push(typeObject);
        await setAllTypes(stateStore, allTypes);
    }
}
