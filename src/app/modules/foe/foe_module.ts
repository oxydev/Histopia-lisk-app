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
import {calculatePendingEra} from "./poolHelper";

export class FoeModule extends BaseModule {
    time = 0;
    public actions = {
        getFOEState: async () => {
            console.log("getFOEState");
            
            let state = await getFOEStateAsJson(this._dataAccess);
            console.log("state", state);
            
            return state;
        },
        getFOEAccountState: async (params: Record<string, unknown>) => {
            const {address} = params;
            return getFOEAccountStateAsJson(this._dataAccess, address);
        }, 
        getPendingEra: async (params: Record<string, unknown>) => {
            const {address} = params;


            let accountState = await getFOEAccountStateAsJson(this._dataAccess, address);
            let state = await getFOEStateAsJson(this._dataAccess);
            let pendingEra = await calculatePendingEra(accountState, state, this.time);
            console.log("pendingEra", Number(pendingEra));
            
            return { amount: Number(pendingEra) };
        },
        getPendingEra2: async (params: Record<string, unknown>) => {
            const {address} = params;


            let accountState = await getFOEAccountStateAsJson(this._dataAccess, address);
            let state = await getFOEStateAsJson(this._dataAccess);
            let pendingEra = await calculatePendingEra(accountState, state, this.time);
            console.log("pendingEra", Number(pendingEra));
            pendingEra = BigInt(pendingEra) + BigInt(10000000000000);
            return { amount: Number(pendingEra) };
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
        this.time = _input.block.header.timestamp;
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
        if (_input.transaction.moduleID === this.id) {
            this.emitHarvestEvent(_input);
        }
    }

    private emitHarvestEvent(_input: TransactionApplyContext) {
        let from = _input.transaction.senderAddress.toString('hex');
        let data = {
            address: from,
            txnId: _input.transaction.id.toString('hex'),
            blockId: _input.stateStore.chain.lastBlockHeaders[0].height,
            timestamp: _input.stateStore.chain.lastBlockHeaders[0].timestamp,
        }
        this._channel.publish('foe:harvest', data);
    }

    private emitDepositEvent(_input: TransactionApplyContext) {
        let assetBuffer = _input.transaction.asset;
        let from = _input.transaction.senderAddress.toString('hex');

        let {tokenIds} = codec.decode<{
            tokenIds: number[]
        }>(
            depositSchema,
            assetBuffer
        );
        let data = {
            tokenIds: tokenIds,
            txnId: _input.transaction.id.toString('hex'),
            blockId: _input.stateStore.chain.lastBlockHeaders[0].height,
            timestamp: _input.stateStore.chain.lastBlockHeaders[0].timestamp,
            address: from
        }
        this._channel.publish('foe:deposit', data);
    }

    private emitWithdrawEvent(_input: TransactionApplyContext) {
        let assetBuffer = _input.transaction.asset;
        let from = _input.transaction.senderAddress.toString('hex');

        let {tokenIds} = codec.decode<{
            tokenIds: number[]
        }>(
            withdrawSchema,
            assetBuffer
        );
        let data = {
            tokenIds: tokenIds,
            txnId: _input.transaction.id.toString('hex'),
            blockId: _input.stateStore.chain.lastBlockHeaders[0].height,
            timestamp: _input.stateStore.chain.lastBlockHeaders[0].timestamp,
            address: from
        }
        this._channel.publish('foe:withdraw', data);
    }

    public async afterGenesisBlockApply(_input: AfterGenesisBlockApplyContext) {
        // Get any data from genesis block, for example get all genesis accounts
        // const genesisAccounts = genesisBlock.header.asset.accounts;
    }
}
