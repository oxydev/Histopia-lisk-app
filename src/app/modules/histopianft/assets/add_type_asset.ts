import { BaseAsset, ApplyAssetContext, ValidateAssetContext } from 'lisk-sdk';
import * as TypeHandler from '../typeHandler';
import {getSystemState, setSystemState} from "../nftHandler";
import {addTypeSchema} from "./assetsSchemas";

export class AddTypeAsset extends BaseAsset {
	public name = 'addType';
	public id = 0;

	public schema = addTypeSchema;


	public validate({ asset }): void {
		// Validate your asset
		if (asset.name.length === 0) {
			throw new Error('Name is too short.');
		}
		if (asset.maxSupply <= 0) {
			throw new Error('Max supply must be greater than zero.');
		}
		if (asset.allowedAccessorTypes < 0) {
			throw new Error('Allowed accessor types must be greater than or equal to zero.');
		}
		for (const assetKey in asset.nftProperties) {
			if (asset.nftProperties[assetKey].minimum > asset.nftProperties[assetKey].maximum) {
				throw new Error('Minimum cannot be greater than maximum.');
			}
		}
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async apply({ asset, transaction, stateStore }: ApplyAssetContext<{}>): Promise<void> {
		const typesState = await getSystemState(stateStore);

		if (typesState.ownerAddress.toString('hex') !== transaction.senderAddress.toString('hex')) {
			throw new Error('You are not the owner!');
		}
		console.log("dcsdc", typesState);
		const typeObject = {
			id: typesState.registeredTypesCount,
			nftProperties: asset.nftProperties,
            name: asset.name,
            maxSupply: asset.maxSupply,
            allowedAccessorTypes: asset.allowedAccessorTypes,
        };

        await TypeHandler.addNewType(stateStore, typeObject.id,  typeObject);
		typesState.registeredTypesCount += 1;
		console.log("dcsdc2", typesState);

		await setSystemState(stateStore, typesState);
	}
}
