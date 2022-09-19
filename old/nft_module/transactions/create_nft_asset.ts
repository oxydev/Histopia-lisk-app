import { BaseAsset  } from "lisk-sdk";
import {
    getAllNFTTokens,
    setAllNFTTokens,
    createNFTToken,
}  from "../nft";

// extend base asset to implement your custom asset
export class CreateNFTAsset extends BaseAsset {
    name = "createNFT";
    id = 0;

    schema = {
        $id: "lisk/nft/create",
        type: "object",
        required: ["minPurchaseMargin", "initValue", "name"],
        properties: {
            minPurchaseMargin: {
                dataType: "uint32",
                fieldNumber: 1,
            },
            initValue: {
                dataType: "uint64",
                fieldNumber: 2,
            },
            name: {
                dataType: "string",
                fieldNumber: 3,
            },
        },
    };

    validate({asset}) {
        if (asset.initValue <= 0) {
            throw new Error("NFT init value is too low.");
        } else if (asset.minPurchaseMargin < 0 || asset.minPurchaseMargin > 100) {
            throw new Error("The NFT minimum purchase value needs to be between 0-100.");
        }
    };

    async apply({ asset, stateStore, reducerHandler, transaction }) {
        // create NFT (2)
        const senderAddress = transaction.senderAddress;
        const senderAccount = await stateStore.account.get(senderAddress);
        const nftToken = createNFTToken({
            name: asset.name,
            ownerAddress: senderAddress,
            nonce: transaction.nonce,
            value: asset.initValue,
            minPurchaseMargin: asset.minPurchaseMargin,
        });

        senderAccount.nft.ownNFTs.push(nftToken.id);
        await stateStore.account.set(senderAddress, senderAccount);

        await reducerHandler.invoke("token:debit", {
            address: senderAddress,
            amount: asset.initValue,
        });

        const allTokens = await getAllNFTTokens(stateStore);
        allTokens.push(nftToken);
        await setAllNFTTokens(stateStore, allTokens);
    }
}
