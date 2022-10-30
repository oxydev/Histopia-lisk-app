import {BaseAsset, ApplyAssetContext, ValidateAssetContext} from 'lisk-sdk';
import * as TypeHandler from "../typeHandler";
import * as NftHandler from "../nftHandler";
import {mintNFTSchema} from "./assetsSchemas";
import {getAccountState, setAccountState} from "../accountHandler";

export class CreateAsset extends BaseAsset {
    public name = 'create';
    public id = 1;

    // Define schema for asset
    public schema = mintNFTSchema

    public validate({asset}: ValidateAssetContext<{}>): void {
        // Validate your asset
    }

    // eslint-disable-next-line @typescript-eslint/require-await
    public async apply({asset: {count, to, typeId}, transaction, reducerHandler, stateStore}: ApplyAssetContext<{}>): Promise<void> {
        let nftsState = await NftHandler.getSystemState(stateStore);

        // console.log("Minting NFT", nftsState);
        let nftProperties = await this.generateNftProperties(stateStore, typeId);

        let accountState = await getAccountState(stateStore, transaction.senderAddress);
        // console.log("Account store", accountState);
        let feeAmount: BigInt = BigInt(nftsState.mintFee) * BigInt(count);
        if (accountState.mintedNFTCount == 0) {
            feeAmount = nftsState.mintFee * BigInt(count - 1);
        }
        if (feeAmount > BigInt(0)) {
            await this.transferAmountToOwner(reducerHandler, feeAmount, transaction.senderAddress, nftsState.ownerAddress);
        }

        for (let i = 0; i < count; i++) {
            let nftId = nftsState.registeredNFTsCount + 1 + i;

            const nftObject = {
                id: nftId,
                typeId: typeId,
                ownerAddress: to,
                nftProperties: nftProperties,
                locked: false
            };
            await NftHandler.setNFTState(stateStore, nftObject.id, nftObject);
        }
        nftsState.registeredNFTsCount += count;
        accountState.mintedNFTCount += count;
        await NftHandler.setSystemState(stateStore, nftsState);

        await setAccountState(stateStore, transaction.senderAddress, accountState);

        if (to !== transaction.senderAddress) {
            accountState = await getAccountState(stateStore, to);
        }

        accountState.ownedNFTCount += count;
        // console.log("Account store", accountState);
        await setAccountState(stateStore, to, accountState);
    }

    private async transferAmountToOwner(reducerHandler, amount, senderAddress, ownerAddress) {
        let balance = await reducerHandler.invoke('token:getBalance', {address: senderAddress});
        // console.log('mint nft1 ', balance);
        if (amount > balance) {
            throw new Error("Not enough balance to mint NFT");
        }
        reducerHandler.invoke('token:debit', {
            address: senderAddress,
            amount: amount,
        });


        reducerHandler.invoke('token:credit', {
            address: ownerAddress,
            amount: amount,
        });
    }

    private async generateNftProperties(stateStore, typeId) {
        let type = await TypeHandler.getType(stateStore, typeId);
        if (type === undefined) {
            throw new Error("Type not found");
        }
        let nftProperties: any[] = [];
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
