import {BaseModule} from "lisk-sdk";
import {getAllNFTTokensAsJSON} from "./nft";
import {CreateNFTAsset} from "./transactions/create_nft_asset";
import {PurchaseNFTAsset} from "./transactions/purchase_nft_asset";
import {TransferNFTAsset} from "./transactions/transfer_nft_asset";


class NFTModule extends BaseModule {
    name = "nft";
    id = 1024;
    accountSchema = {
        type: "object",
        required: ["ownNFTs"],
        properties: {
            ownNFTs: {
                type: "array",
                fieldNumber: 4,
                items: {
                    dataType: "bytes",
                },
            },
        },
        default: {
            ownNFTs: [],
        },
    };
    transactionAssets = [new CreateNFTAsset(), new PurchaseNFTAsset(), new TransferNFTAsset()];
    actions = {
        // get all the registered NFT tokens from blockchain
        getAllNFTTokens: async () => getAllNFTTokensAsJSON(this._dataAccess),
    };
}

module.exports = {NFTModule};
