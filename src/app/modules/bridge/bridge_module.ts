/* eslint-disable class-methods-use-this */

import {
    AfterBlockApplyContext,


    AfterGenesisBlockApplyContext, BaseModule,


    BeforeBlockApplyContext, GenesisConfig, TransactionApplyContext
} from 'lisk-sdk';
import { AddCommitmentAsset } from "./assets/add_commitment_asset";
import { WithdrawBridgeAsset } from "./assets/withdraw_bridge_asset";
import {getMerkleState, getMerkleStateAsJson} from "./StateStoreHandlers/MerkleStateHandler";

export class BridgeModule extends BaseModule {
    public actions = {
      getMerkleState: async () => getMerkleStateAsJson(this._dataAccess),

    };
    public reducers = {};
    public name = 'bridge';
    public transactionAssets = [new AddCommitmentAsset(), new WithdrawBridgeAsset()];
    public events = [];
    public id = 1030;

    // public constructor(genesisConfig: GenesisConfig) {
    //     super(genesisConfig);
    //
    //
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
