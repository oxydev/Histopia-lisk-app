/* eslint-disable class-methods-use-this */

import {
    AfterBlockApplyContext,
    AfterGenesisBlockApplyContext,
    BaseModule,
    BeforeBlockApplyContext, codec,
    StateStore,
    TransactionApplyContext
} from 'lisk-sdk';
import { AddTypeAsset } from "./assets/add_type_asset";
import {addTypeSchema, destroyNFTSchema, mintNFTSchema, transferNFTSchema} from "./assets/assetsSchemas";
import { CreateAsset } from "./assets/create_asset";
import { DestroyAsset } from "./assets/destroy_asset";
import { SetMintFeeAsset } from "./assets/set_mint_fee_asset";
import { TransferAsset } from "./assets/transfer_asset";
import * as NftHandler from './nftHandler';
import * as TypeHandler from './typeHandler';
import {getAccountState} from "./accountHandler";

export class HistopianftModule extends BaseModule {
    public actions = {
        getType: async (typeId: number) => {
            return  TypeHandler.getTypeAsJson(this._dataAccess, typeId);
        },
        getSystemState: async () => {
            return  NftHandler.getSystemStateAsJson(this._dataAccess);
        },
        getNFT: async (nftId) => {
            return NftHandler.getNFTAsJson(this._dataAccess, nftId);
        },
        getAccountState: async (address) => {
            return getAccountState(this._dataAccess, address);
        }
        // getBalance: async (address) => {
        //     return NftHandler.getBalanceAsJson(this._dataAccess, address);
        // }
        // getAllNFTs: async () => {
        //     return getAllNFTsAsJSON(this._dataAccess)
        // }
    };
    public reducers = {
        // Example below
        getType: async (
			params: Record<string, unknown>,
			stateStore: StateStore,
		): Promise<bigint> => {
			const { typeId } = params;
			if (!typeId) {
                throw new Error('Must provide typeId');
            }
            return await TypeHandler.getType(stateStore, typeId);
		},
    };

    public name = 'histopianft';
    public transactionAssets = [new AddTypeAsset(), new CreateAsset(), new DestroyAsset(), new TransferAsset(), new SetMintFeeAsset()];
    public events = [
        'newType',
        'newNFT',
        'destroyNFT',
        'transferNFT',
        'setMintFee',
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

        if (_input.transaction.moduleID === this.id && _input.transaction.assetID === 1) {
            console.log('New NFT created', _input.stateStore.chain.lastBlockHeaders[0].height);
            let assetBuffer = _input.transaction.asset;
            let asset = codec.decode(
                mintNFTSchema,
                assetBuffer
            );
            NftHandler.getSystemState(_input.stateStore).then((nftState) => {
                for (let i = 0; i < asset.count; i++) {
                    NftHandler.getNFT(_input.stateStore, nftState.registeredNFTsCount - i).then((nft) => {
                        console.log("nft",nft, nftState.registeredNFTsCount - i, nftState.registeredNFTsCount);
                        let data = {
                            id: nftState.registeredNFTsCount - i,
                            to: asset.to.toString('hex'),
                            typeId: asset.typeId,
                            properties: nft.nftProperties,
                            txnId: _input.transaction._id.toString('hex'),
                            blockId: _input.stateStore.chain.lastBlockHeaders[0].height,
                        }
                        // console.log("new nft", data);
                        this._channel.publish('histopianft:newNFT', data);
                    })
                }
            })
        } else if (_input.transaction.moduleID === this.id && _input.transaction.assetID === 0) {
            let assetBuffer = _input.transaction.asset;
            let asset = codec.decode(
                addTypeSchema,
                assetBuffer
            );
            NftHandler.getSystemState(_input.stateStore).then((systemState) => {
                let typeId = systemState.registeredTypesCount - 1;
                // console.log("typeId", asset);
                let data = {
                    id: typeId,
                    name: asset.name,
                    properties: asset.nftProperties,
                    allowedAccessorTypes: asset.allowedAccessorTypes,
                    maxSupply: asset.maxSupply,
                    txnId: _input.transaction._id.toString('hex'),
                    blockId: _input.stateStore.chain.lastBlockHeaders[0].height,
                }
                this._channel.publish('histopianft:newType', data);
            })
        } else if (_input.transaction.moduleID === this.id && _input.transaction.assetID === 2) {
            let assetBuffer = _input.transaction.asset;
            let asset = codec.decode(
                destroyNFTSchema,
                assetBuffer
            );
            let data = {
                id: asset.nftId,
                from: _input.transaction.senderAddress.toString('hex'),
                txnId: _input.transaction._id.toString('hex'),
                blockId: _input.stateStore.chain.lastBlockHeaders[0].height,
            }
            this._channel.publish('histopianft:destroyNFT', data);
        }
        else if (_input.transaction.moduleID === this.id && _input.transaction.assetID === 3) {
            let assetBuffer = _input.transaction.asset;
            let asset = codec.decode(
                transferNFTSchema,
                assetBuffer
            );
            let data = {
                id: asset.nftId,
                from: _input.transaction.senderAddress.toString('hex'),
                to: asset.to.toString('hex'),
                txnId: _input.transaction._id.toString('hex'),
                blockId: _input.stateStore.chain.lastBlockHeaders[0].height,
            }
            this._channel.publish('histopianft:newType', data);
        }
    }

    public async afterGenesisBlockApply(_input: AfterGenesisBlockApplyContext) {
        // Get any data from genesis block, for example get all genesis accounts
        // const genesisAccounts = genesisBlock.header.asset.accounts;
    }
}
