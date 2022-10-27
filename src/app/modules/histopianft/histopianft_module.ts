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
import { CreateAsset } from "./assets/create_asset";
import { DestroyAsset } from "./assets/destroy_asset";
import { MintNFTAsset } from "./assets/mint_n_f_t_asset";
import { TransferAsset } from "./assets/transfer_asset";
import * as NftHandler from './nftHandler';
import * as TypeHandler from './typeHandler';
import {nftTokenSchema} from "./schemas";
import {mintNFTSchema} from "./assets/assetsSchemas";

export class HistopianftModule extends BaseModule {
    public actions = {
        getType: async (typeId: number) => {
            return  TypeHandler.getTypeAsJson(this._dataAccess, typeId);
        },
        getTypesState: async () => {
            return TypeHandler.getTypesStateAsJson(this._dataAccess);
        },
        getNfTsState: async () => {
            return NftHandler.getNFTsStateAsJson(this._dataAccess);
        },
        getNfT: async (nftId) => {
            return NftHandler.getNFTAsJson(this._dataAccess, nftId);
        }
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
    public transactionAssets = [new AddTypeAsset(), new MintNFTAsset(), new CreateAsset(), new DestroyAsset(), new TransferAsset()];
    public events = [
        'newType',
        'newNFT',
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
            // console.log('New NFT created', _input);
            let assetBuffer = _input.transaction.asset;
            let asset = codec.decode(
                mintNFTSchema,
                assetBuffer
            );
            NftHandler.getNFTsState(_input.stateStore).then((nftState) => {
                NftHandler.getNFT(_input.stateStore, nftState.registeredNFTsCount).then((nft) => {
                    // console.log("nft",nft);
                    let data = {
                        id: nftState.registeredNFTsCount,
                        to: asset.to.toString('hex', 0, 20),
                        typeId: asset.typeId,
                        properties: nft.nftProperties,
                        txnId: _input.transaction._id.toString('hex', 0, 40),
                    }
                    // console.log("new nft", data);
                    this._channel.publish('histopianft:newNFT', data);
                })

            })
        }
    }

    public async afterGenesisBlockApply(_input: AfterGenesisBlockApplyContext) {
        // Get any data from genesis block, for example get all genesis accounts
        // const genesisAccounts = genesisBlock.header.asset.accounts;
    }
}
