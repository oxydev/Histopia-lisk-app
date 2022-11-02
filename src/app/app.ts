import {Application, PartialApplicationConfig, utils} from 'lisk-sdk';
import {registerModules} from './modules';
import {registerPlugins} from './plugins';
// const { codec, cryptography } = require("lisk-sdk");

export const getApplication = (
    genesisBlock: Record<string, unknown>,
    config: PartialApplicationConfig,
): Application => {

    console.log("getApplication", genesisBlock, config);

    const appConfig = {
        ...config,

        plugins: {
            faucet: {
            	encryptedPassphrase: "iterations=1000000&cipherText=148581850cd47f4c4fa4327f64de9008f393b044eb80875cbfd2adde21c4876ecf1e0d448caa153946c01487fafb192aa7978bc7857cdf9cce3c0ddc25c86cc8693290f2e7ba483a&iv=352072b6ec4b8c0d576ca2e9&salt=8073c6088313a36791842465ea1d5138&tag=3f45d1c0e1b0042bb843a63bb8604547&version=1",
                captchaSecretkey: "6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe",
                captchaSitekey: "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI",
            	// port: 4004,
            	// host: '0.0.0.0',
                // applicationUrl: 'wss://lisk.histopia.io/wss',
                applicationUrl: 'ws://localhost:8081/ws',
            	// fee: '0.1',
            	amount: '2600', //2600 * 10^8
            	// tokenPrefix: 'ERA',
            },

            dashboard: {
                // applicationUrl: 'wss://lisk.histopia.io/wss',
                applicationUrl: 'ws://localhost:8081/ws',
                port: 4005,
                host: '127.0.0.1',
                applicationName: 'Histopia',
            }
        }
    }

    // appConfig.rpc = {
    //     "enable": true,
    //     "mode": "ws",
    //     "port": 8081,
    //     "host": '0.0.0.0'
    // }

    // console.log("appConfig", genesisBlock);
    const app = Application.defaultApplication(genesisBlock, appConfig);

    registerModules(app);
    registerPlugins(app);

    return app;
};
