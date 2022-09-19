/* eslint-disable @typescript-eslint/no-empty-function */
import { Application, HTTPAPIPlugin } from 'lisk-sdk';
import { GetAllTypesPlugin } from "./plugins/get_all_types/get_all_types_plugin";
import { FaucetPlugin } from '@liskhq/lisk-framework-faucet-plugin';

export const registerPlugins = (app: Application): void => {

    app.registerPlugin(GetAllTypesPlugin);
    app.registerPlugin(HTTPAPIPlugin);
    // app.registerPlugin(FaucetPlugin);
};
