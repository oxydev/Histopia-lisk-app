/* eslint-disable class-methods-use-this */

import {
    AfterBlockApplyContext,


    AfterGenesisBlockApplyContext, BaseModule,


    BeforeBlockApplyContext, TransactionApplyContext
} from 'lisk-sdk';
import { DepositAsset } from "./assets/deposit_asset";
import { HarvestAsset } from "./assets/harvest_asset";
import { WithdrawAsset } from "./assets/withdraw_asset";
import {getFOEStateAsJson} from "./StateStoreHandlers/FOEStateHandler";
import {getFOEAccountStateAsJson} from "./StateStoreHandlers/FOEAccountHandler";

export class FoeModule extends BaseModule {
    public actions = {
        getFOEState: async () => {
            return getFOEStateAsJson(this._dataAccess);
        },
        getFOEAccountState: async (params: Record<string, unknown>) => {
            const { address } = params;
            return getFOEAccountStateAsJson(this._dataAccess, address);
        }
    };
    public reducers = {
    };
    public name = 'foe';
    public transactionAssets = [new DepositAsset(), new WithdrawAsset(), new HarvestAsset()];
    public events = [
        // Example below
        // 'foe:newBlock',
    ];
    public id = 1025;


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
