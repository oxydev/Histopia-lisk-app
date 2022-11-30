import { BaseAsset, ApplyAssetContext, ValidateAssetContext } from 'lisk-sdk';

export class DepositAsset extends BaseAsset {
	public name = 'deposit';
  public id = 1;

  // Define schema for asset
	public schema = {
    $id: 'foe/deposit-asset',
		title: 'DepositAsset transaction asset for foe module',
		type: 'object',
		required: [],
		properties: {},
  };

  public validate({ asset }: ValidateAssetContext<{}>): void {
    // Validate your asset
  }

	// eslint-disable-next-line @typescript-eslint/require-await
  public async apply({ asset, transaction, stateStore }: ApplyAssetContext<{}>): Promise<void> {
		throw new Error('Asset "deposit" apply hook is not implemented.');
	}
}
