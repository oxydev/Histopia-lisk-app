
// 1.plugin can be a daemon/HTTP/Websocket service for off-chain processing
import express from "express";
import {BasePlugin, codec} from "lisk-sdk";
import {getAllTransactions, getDBInstance, getNFTHistory, saveTransactions} from "./db";

class NFTAPIPlugin extends BasePlugin {
    _server = null;
    _app = null;
    _channel = null;
    _db = null;
    _nodeInfo = null;

    static get alias() {
        return "NFTHttpApi";
    }

    get defaults() {
        return {};
    }

    get events() {
        return [];
    }

    get actions() {
        return {};
    }

    async load(channel) {
        this._app = express();
        this._channel = channel;
        this._db = await getDBInstance();
        // @ts-ignore
        this._nodeInfo = await this._channel.invoke("app:getNodeInfo");
        // @ts-ignore
        this._app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT"] }));
        // @ts-ignore

        this._app.use(express.json());
        // @ts-ignore

        this._app.get("/api/nft_tokens", async (_req, res) => {
            // @ts-ignore

            const nftTokens = await this._channel.invoke("nft:getAllNFTTokens");
            const data = await Promise.all(nftTokens.map(async token => {
                const dbKey = `${token.name}`;
                let tokenHistory = await getNFTHistory(this._db, dbKey);
                tokenHistory = tokenHistory.map(h => h.toString('binary'));
                return {
                    ...token,
                    tokenHistory,
                }
            }));

            res.json({ data });
        });
        // @ts-ignore

        this._app.get("/api/nft_tokens/:id", async (req, res) => {
            // @ts-ignore

            const nftTokens = await this._channel.invoke("nft:getAllNFTTokens");
            const token = nftTokens.find((t) => t.id === req.params.id);
            const dbKey = `${token.name}`;
            let tokenHistory = await getNFTHistory(this._db, dbKey);
            tokenHistory = tokenHistory.map(h => h.toString('binary'));

            res.json({ data: { ...token, tokenHistory } });
        });
        // @ts-ignore

        this._app.get("/api/transactions", async (_req, res) => {
            const transactions = await getAllTransactions(this._db, this.schemas);

            const data = transactions.map(trx => {
                // @ts-ignore

                const module = this._nodeInfo.registeredModules.find(m => m.id === trx.moduleID);
                const asset = module.transactionAssets.find(a => a.id === trx.assetID);
                return {
                    ...trx,
                    ...trx.asset,
                    moduleName: module.name,
                    assetName: asset.name,
                }
            })
            res.json({ data });
        });

        this._subscribeToChannel();
        // @ts-ignore

        this._server = this._app.listen(8080, "0.0.0.0");
    }

    _subscribeToChannel() {
        // listen to application events and enrich blockchain data for UI/third party application
        // @ts-ignore

        this._channel.subscribe('app:block:new', async (data) => {
            const { block } = data;
            const { payload } = codec.decode(
                this.schemas.block,
                Buffer.from(block, 'hex'),
            );
            if (payload.length > 0) {
                await saveTransactions(this._db, payload);
                const decodedBlock = this.codec.decodeBlock(block);
                // save NFT transaction history
                // @ts-ignore

                await saveNFTHistory(this._db, decodedBlock, this._nodeInfo.registeredModules, this._channel);
            }
        });
    }

    async unload() {
        // close http server
        await new Promise((resolve, reject) => {
            // @ts-ignore

            this._server.close((err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(true);
            });
        });
        // close database connection
        // @ts-ignore
        await this._db.close();
    }
}

module.exports = { NFTAPIPlugin };
