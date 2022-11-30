import { BaseAsset, ApplyAssetContext, ValidateAssetContext } from 'lisk-sdk';

export class WithdrawAsset extends BaseAsset {
	public name = 'withdraw';
  public id = 2;

  // Define schema for asset
	public schema = {
    $id: 'foe/withdraw-asset',
		title: 'WithdrawAsset transaction asset for foe module',
		type: 'object',
		required: [],
		properties: {},
  };

  public validate({ asset }: ValidateAssetContext<{}>): void {
    // Validate your asset
  }

	// eslint-disable-next-line @typescript-eslint/require-await
  public async apply({ asset, transaction, stateStore }: ApplyAssetContext<{}>): Promise<void> {
		throw new Error('Asset "withdraw" apply hook is not implemented.');
	}
}
