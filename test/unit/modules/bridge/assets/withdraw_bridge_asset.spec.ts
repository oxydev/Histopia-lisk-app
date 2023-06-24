import { WithdrawBridgeAsset } from '../../../../../src/app/modules/bridge/assets/withdraw_bridge_asset';

describe('WithdrawBridgeAsset', () => {
  let transactionAsset: WithdrawBridgeAsset;

	beforeEach(() => {
		transactionAsset = new WithdrawBridgeAsset();
	});

	describe('constructor', () => {
		it('should have valid id', () => {
			expect(transactionAsset.id).toEqual(2);
		});

		it('should have valid name', () => {
			expect(transactionAsset.name).toEqual('WithdrawBridge');
		});

		it('should have valid schema', () => {
			expect(transactionAsset.schema).toMatchSnapshot();
		});
	});

	describe('validate', () => {
		describe('schema validation', () => {
      it.todo('should throw errors for invalid schema');
      it.todo('should be ok for valid schema');
    });
	});

	describe('apply', () => {
    describe('valid cases', () => {
      it.todo('should update the state store');
    });

    describe('invalid cases', () => {
      it.todo('should throw error');
    });
	});
});
