import { Application, PartialApplicationConfig } from 'lisk-sdk';
import { registerModules } from './modules';
import { registerPlugins } from './plugins';
const { codec, cryptography } = require("lisk-sdk");

export const getApplication = (
	genesisBlock: Record<string, unknown>,
	config: PartialApplicationConfig,
): Application => {
	const encryptedPassphrase = cryptography.encryptPassphraseWithPassword(
		'peanut hundred pen hawk invite exclude brain chunk gadget wait wrong ready',
		'some secure password',
	);
	const appConfig = {
		...config,

		plugins: {
			// faucet: {
			// 	encryptedPassphrase: encryptedPassphrase,
			// 	port: 4004,
			// 	host: '0.0.0.0',
			// 	applicationUrl: 'ws://localhost:8082/ws',
			// 	fee: '0.1',
			// 	amount: '10000',
			// 	tokenPrefix: 'lsk',
			// },
			dashboard: {
				applicationUrl: 'wss://lisk.histopia.io/wss/ws',
				port: 4005,
				host: '0.0.0.0',
				applicationName: 'Lisk',
			}
		}
	}
	const app = Application.defaultApplication(genesisBlock, appConfig);

	registerModules(app);
	registerPlugins(app);

	return app;
};
