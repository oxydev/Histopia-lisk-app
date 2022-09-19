import { BaseAsset, ApplyAssetContext, ValidateAssetContext } from 'lisk-sdk';
import { getAllTypes, setAllTypes } from '../typeHandler';

export class AddTypeAsset extends BaseAsset {
	public name = 'addType';
	public id = 0;

	// Define schema for asset
	public schema = {
		$id: 'histopianft/addType-asset',
		title: 'AddTypeAsset transaction asset for histopianft module',
		type: 'object',
		required: ["name", "maxSupply", "allowedAccessorTypes", "nftProperties"],
		properties: {
			name: {
				dataType: 'string',
				fieldNumber: 1,
			},
			maxSupply: {
				dataType: 'uint32',
				fieldNumber: 2,
			},
			allowedAccessorTypes: {
				dataType: 'uint32',
				fieldNumber: 3,
			},
			nftProperties: {
				type: 'array',
				fieldNumber: 4,
				items: {
					type: 'object',
					required: ['name', 'minimum', 'maximum'],
					properties: {
						name: {
							dataType: 'string',
							fieldNumber: 1,
						},
						minimum: {
							dataType: 'uint32',
							fieldNumber: 2,
						},
						maximum: {
							dataType: 'uint32',
							fieldNumber: 3,
						},
					}
				}
			},

		},
	};


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
		const allTypes = await getAllTypes(stateStore);

		const typeObject = {
			id: allTypes.length(),
			nftProperties: asset.nftProperties,
            name: asset.name,
            maxSupply: asset.maxSupply,
            allowedAccessorTypes: asset.allowedAccessorTypes,
        };
        allTypes.push(typeObject);
        await setAllTypes(stateStore, allTypes);
	}
}
