/* eslint-disable class-methods-use-this */

import {
    AfterBlockApplyContext,
    AfterGenesisBlockApplyContext,
    BaseModule,
    BeforeBlockApplyContext,
    codec,
    TransactionApplyContext
} from 'lisk-sdk';
import {DepositAsset} from "./assets/deposit_asset";
import {HarvestAsset} from "./assets/harvest_asset";
import {WithdrawAsset} from "./assets/withdraw_asset";
import {getFOEStateAsJson} from "./StateStoreHandlers/FOEStateHandler";
import {getFOEAccountStateAsJson} from "./StateStoreHandlers/FOEAccountHandler";
import {depositSchema, withdrawSchema} from "./assets/assetsSchemas";

export class FoeModule extends BaseModule {
    public actions = {
        getFOEState: async () => {
            return getFOEStateAsJson(this._dataAccess);
        },
        getFOEAccountState: async (params: Record<string, unknown>) => {
            const {address} = params;
            return getFOEAccountStateAsJson(this._dataAccess, address);
        }
    };
    public reducers = {};
    public name = 'foe';
    public transactionAssets = [new DepositAsset(), new WithdrawAsset(), new HarvestAsset()];
    public events = [
        "deposit",
        "withdraw",
        "harvest"
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
        if (_input.transaction.moduleID === this.id && _input.transaction.assetID === 1) {
            this.emitDepositEvent(_input);
        } else if (_input.transaction.moduleID === this.id && _input.transaction.assetID === 2) {
            this.emitWithdrawEvent(_input);
        } 
        this.emitHarvestEvent(_input);
    }

    private emitHarvestEvent(_input: TransactionApplyContext) {
        let from = _input.transaction.senderAddress.toString('hex');
        let data = {
            address: from
        }
        this._channel.publish('foe:deposit', data);
    }

    private emitDepositEvent(_input: TransactionApplyContext) {
        let assetBuffer = _input.transaction.asset;
        let {tokenIds} = codec.decode<{
            tokenIds: number[]
        }>(
            depositSchema,
            assetBuffer
        );
        let data = {
            tokenIds: tokenIds
        }
        this._channel.publish('foe:deposit', data);
    }

    private emitWithdrawEvent(_input: TransactionApplyContext) {
        let assetBuffer = _input.transaction.asset;
        let {tokenIds} = codec.decode(
            withdrawSchema,
            assetBuffer
        );
        let data = {
            tokenIds: tokenIds
        }
        this._channel.publish('foe:withdraw', data);
    }

    public async afterGenesisBlockApply(_input: AfterGenesisBlockApplyContext) {
        // Get any data from genesis block, for example get all genesis accounts
        // const genesisAccounts = genesisBlock.header.asset.accounts;
    }
}
