import { SetMintFeeAsset } from '../../../../../src/app/modules/histopianft/assets/set_mint_fee_asset';

describe('SetMintFeeAsset', () => {
  let transactionAsset: SetMintFeeAsset;

	beforeEach(() => {
		transactionAsset = new SetMintFeeAsset();
	});

	describe('constructor', () => {
		it('should have valid id', () => {
			expect(transactionAsset.id).toEqual(5);
		});

		it('should have valid name', () => {
			expect(transactionAsset.name).toEqual('setMintFee');
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
