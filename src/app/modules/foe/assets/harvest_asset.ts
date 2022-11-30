import { BaseAsset, ApplyAssetContext, ValidateAssetContext } from 'lisk-sdk';

export class HarvestAsset extends BaseAsset {
	public name = 'harvest';
  public id = 3;

  // Define schema for asset
	public schema = {
    $id: 'foe/harvest-asset',
		title: 'HarvestAsset transaction asset for foe module',
		type: 'object',
		required: [],
		properties: {},
  };

  public validate({ asset }: ValidateAssetContext<{}>): void {
    // Validate your asset
  }

	// eslint-disable-next-line @typescript-eslint/require-await
  public async apply({ asset, transaction, stateStore }: ApplyAssetContext<{}>): Promise<void> {
		throw new Error('Asset "harvest" apply hook is not implemented.');
	}
}
