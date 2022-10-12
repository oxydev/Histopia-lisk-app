import {Application, PartialApplicationConfig} from 'lisk-sdk';
import {registerModules} from './modules';
import {registerPlugins} from './plugins';
// const { codec, cryptography } = require("lisk-sdk");

export const getApplication = (
    genesisBlock: Record<string, unknown>,
    config: PartialApplicationConfig,
): Application => {
    // const encryptedPassphrase = cryptography.encryptPassphraseWithPassword(
    // 	'peanut hundred pen hawk invite exclude brain chunk gadget wait wrong ready',
    // 	'some secure password',
    // );
    // console.log("getApplication", genesisBlock, config.forging.delegates[0]);
    const appConfig = {
        ...config,

        plugins: {
            faucet: {
            	encryptedPassphrase: "iterations=1000000&cipherText=148581850cd47f4c4fa4327f64de9008f393b044eb80875cbfd2adde21c4876ecf1e0d448caa153946c01487fafb192aa7978bc7857cdf9cce3c0ddc25c86cc8693290f2e7ba483a&iv=352072b6ec4b8c0d576ca2e9&salt=8073c6088313a36791842465ea1d5138&tag=3f45d1c0e1b0042bb843a63bb8604547&version=1",
                captchaSecretkey: "6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe",
                captchaSitekey: "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI",
            	// port: 4004,
            	// host: '0.0.0.0',
            	// applicationUrl: 'ws://localhost:8082/ws',
            	// fee: '0.1',
            	// amount: '10000',
            	// tokenPrefix: 'lsk',
            },

            dashboard: {
                applicationUrl: 'ws://localhost:8080/ws',
                port: 4005,
                host: '127.0.0.1',
                applicationName: 'Lisk',
            }
        }
    }

    appConfig.rpc = {
        "enable": true,
        "mode": "ws",
        "port": 8080,
        "host": '127.0.0.1'
    }

    console.log("appConfig", appConfig.plugins);
    const app = Application.defaultApplication(genesisBlock, appConfig);

    registerModules(app);
    registerPlugins(app);

    return app;
};
