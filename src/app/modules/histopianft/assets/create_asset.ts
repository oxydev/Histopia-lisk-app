import {BaseAsset, ApplyAssetContext, ValidateAssetContext} from 'lisk-sdk';
import * as TypeHandler from "../StateStoreHandlers/typeHandler";
import * as NftHandler from "../StateStoreHandlers/nftHandler";
import {mintNFTSchema} from "./assetsSchemas";
import {getAccountState, setAccountState} from "../StateStoreHandlers/accountHandler";

export class CreateAsset extends BaseAsset {
    public name = 'create';
    public id = 1;

    // Define schema for asset
    public schema = mintNFTSchema

    public validate({asset: {}}: ValidateAssetContext<{}>): void {
        // Validate your asset
    }

    public async apply({asset: {count, to, typeId}, transaction, reducerHandler, stateStore}: ApplyAssetContext<{
        count: number,
        to: Buffer,
        typeId: number
    }>): Promise<void> {
        let nftsState = await NftHandler.getSystemState(stateStore);

        let senderAddress = transaction.senderAddress.toString('hex');
        let toAddress = to.toString('hex');

        let accountState = await getAccountState(stateStore, senderAddress);
        let feeAmount: BigInt = BigInt(nftsState.mintFee) * BigInt(count);

        if (accountState.mintedNFTCount == 0) {
            feeAmount = nftsState.mintFee * BigInt(count - 1);
        }

        if (feeAmount > BigInt(0) && senderAddress !== nftsState.ownerAddress) {
            await this.transferAmountToOwner(reducerHandler, feeAmount, transaction.senderAddress, nftsState.ownerAddress);
        }

        for (let i = 0; i < count; i++) {
            let nftProperties = await this.generateNftProperties(stateStore, typeId);

            let nftId = nftsState.registeredNFTsCount + 1 + i;

            const nftObject = {
                id: nftId,
                typeId: typeId,
                ownerAddress: to,
                nftProperties: nftProperties,
                locked: false
            };
            await NftHandler.setNFTState(stateStore, nftObject);
        }
        nftsState.registeredNFTsCount += count;
        accountState.mintedNFTCount += count;
        await NftHandler.setSystemState(stateStore, nftsState);


        if (toAddress !== senderAddress) {
            await setAccountState(stateStore, senderAddress, accountState);
            accountState = await getAccountState(stateStore, toAddress);
        }
        accountState.ownedNFTs.push(...Array.from(Array(count).keys()).map((i) => nftsState.registeredNFTsCount - count + i + 1));
        accountState.ownedNFTCount += count;
        await setAccountState(stateStore, toAddress, accountState);
    }

    private async transferAmountToOwner(reducerHandler, amount, senderAddress, ownerAddress) {
        let balance = await reducerHandler.invoke('token:getBalance', {address: senderAddress});
        if (amount > balance) {
            throw new Error("Not enough balance to mint NFT");
        }
        await reducerHandler.invoke('token:debit', {
            address: senderAddress,
            amount: amount,
        });


        await reducerHandler.invoke('token:credit', {
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
