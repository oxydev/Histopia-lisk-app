const { BaseAsset } = require("lisk-sdk");
const { getAllNFTTokens, setAllNFTTokens } = require("../nft");

// extend base asset to implement your custom asset
class PurchaseNFTAsset extends BaseAsset {
    // define unique asset name and id
    name = "purchaseNFT";
    id = 1;
    // define asset schema for serialization
    schema = {
        $id: "lisk/nft/purchase",
        type: "object",
        required: ["nftId", "purchaseValue", "name"],
        properties: {
            nftId: {
                dataType: "bytes",
                fieldNumber: 1,
            },
            purchaseValue: {
                dataType: "uint64",
                fieldNumber: 2,
            },
            name: {
                dataType: "string",
                fieldNumber: 3,
            },
        },
    };

    async apply({ asset, stateStore, reducerHandler, transaction }) {
        // verify if purchasing nft exists (1)
        const nftTokens = await getAllNFTTokens(stateStore);
        const nftTokenIndex = nftTokens.findIndex((t) => t.id.equals(asset.nftId));

        if (nftTokenIndex < 0) {
            throw new Error("Token id not found");
        }
        // verify if minimum nft purchasing condition met (2)
        const token = nftTokens[nftTokenIndex];
        const tokenOwner = await stateStore.account.get(token.ownerAddress);
        const tokenOwnerAddress = tokenOwner.address;

        if (token && token.minPurchaseMargin === 0) {
            throw new Error("This NFT can not be purchased");
        }

        const tokenCurrentValue = token.value;
        const tokenMinPurchaseValue =
            tokenCurrentValue +
            (tokenCurrentValue * BigInt(token.minPurchaseMargin)) / BigInt(100);
        const purchaseValue = asset.purchaseValue;

        if (tokenMinPurchaseValue > purchaseValue) {
            throw new Error("Token can not be purchased. Purchase value is too low. Minimum value: " + tokenMinPurchaseValue);
        }

        // remove nft from owner account (3)
        const purchaserAddress = transaction.senderAddress;
        const purchaserAccount = await stateStore.account.get(purchaserAddress);

        const ownerTokenIndex = tokenOwner.nft.ownNFTs.findIndex((a) =>
            a.equals(token.id)
        );
        tokenOwner.nft.ownNFTs.splice(ownerTokenIndex, 1);
        await stateStore.account.set(tokenOwnerAddress, tokenOwner);

        // add nft to purchaser account (4)
        purchaserAccount.nft.ownNFTs.push(token.id);
        await stateStore.account.set(purchaserAddress, purchaserAccount);

        token.ownerAddress = purchaserAddress;
        token.value = purchaseValue;
        nftTokens[nftTokenIndex] = token;
        await setAllNFTTokens(stateStore, nftTokens);

        // debit LSK tokens from purchaser account (5)
        await reducerHandler.invoke("token:debit", {
            address: purchaserAddress,
            amount: purchaseValue,
        });

        // credit LSK tokens to purchaser account (6)
        await reducerHandler.invoke("token:credit", {
            address: tokenOwnerAddress,
            amount: purchaseValue,
        });
    }
}

module.exports = PurchaseNFTAsset;
