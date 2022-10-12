import { MintNFTAsset } from '../../../../../src/app/modules/histopianft/assets/mint_n_f_t_asset';

describe('MintNFTAsset', () => {
  let transactionAsset: MintNFTAsset;

	beforeEach(() => {
		transactionAsset = new MintNFTAsset();
	});

	describe('constructor', () => {
		it('should have valid id', () => {
			expect(transactionAsset.id).toEqual(1);
		});

		it('should have valid name', () => {
			expect(transactionAsset.name).toEqual('mintNFT');
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
