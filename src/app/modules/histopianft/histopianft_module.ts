/* eslint-disable class-methods-use-this */

import {
    AfterBlockApplyContext,
    AfterGenesisBlockApplyContext, BaseModule,
    BeforeBlockApplyContext, TransactionApplyContext
} from 'lisk-sdk';
import { AddTypeAsset } from "./assets/add_type_asset";
import { MintNFTAsset } from "./assets/mint_n_f_t_asset";
import { getAllTypesAsJSON } from './typeHandler';
import {getAllNFTsAsJSON} from "./nftHandler";
import * as TypeHandler from './typeHandler';

export class HistopianftModule extends BaseModule {
    public actions = {
        getAllTypes: async () => {
            return  getAllTypesAsJSON(this._dataAccess)
        },
        getAllNFTs: async () => {
            return getAllNFTsAsJSON(this._dataAccess)
        },
        getTypesState: async () => {
            return TypeHandler.getTypesStateAsJson(this._dataAccess);
        },
    };
    public reducers = {
        // Example below
        // getBalance: async (
		// 	params: Record<string, unknown>,
		// 	stateStore: StateStore,
		// ): Promise<bigint> => {
		// 	const { address } = params;
		// 	if (!Buffer.isBuffer(address)) {
		// 		throw new Error('Address must be a buffer');
		// 	}
		// 	const account = await stateStore.account.getOrDefault<TokenAccount>(address);
		// 	return account.token.balance;
		// },
    };
    public name = 'histopianft';
    public transactionAssets = [new AddTypeAsset(), new MintNFTAsset()];
    public events = [
        'histopianft:newType',
        'histopianft:newNFT',
    ];
    public id = 1024;

    // public constructor(genesisConfig: GenesisConfig) {
    //     super(genesisConfig);
    // }

    // Lifecycle hooks
    public async beforeBlockApply(_input: BeforeBlockApplyContext) {
        // Get any data from stateStore using block info, below is an example getting a generator
        // const generatorAddress = getAddressFromPublicKey(_input.block.header.generatorPublicKey);
		// const generator = await _input.stateStore.account.get<TokenAccount>(generatorAddress);
    }

    public async afterBlockApply(_input: AfterBlockApplyContext) {
        // Get any data from stateStore using block info, below is an example getting a generator
        // const generatorAddress = getAddressFromPublicKey(_input.block.header.generatorPublicKey);
		// const generator = await _input.stateStore.account.get<TokenAccount>(generatorAddress);
    }

    public async beforeTransactionApply(_input: TransactionApplyContext) {
        // Get any data from stateStore using transaction info, below is an example
        // const sender = await _input.stateStore.account.getOrDefault<TokenAccount>(_input.transaction.senderAddress);
    }

    public async afterTransactionApply(_input: TransactionApplyContext) {
        // Get any data from stateStore using transaction info, below is an example
        // const sender = await _input.stateStore.account.getOrDefault<TokenAccount>(_input.transaction.senderAddress);
    }

    public async afterGenesisBlockApply(_input: AfterGenesisBlockApplyContext) {
        // Get any data from genesis block, for example get all genesis accounts
        // const genesisAccounts = genesisBlock.header.asset.accounts;
    }
}
