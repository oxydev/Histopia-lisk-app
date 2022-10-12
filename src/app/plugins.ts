/* eslint-disable @typescript-eslint/no-empty-function */
import { Application, HTTPAPIPlugin } from 'lisk-sdk';
import { GetAllTypesPlugin } from "./plugins/get_all_types/get_all_types_plugin";
import { FaucetPlugin } from '@liskhq/lisk-framework-faucet-plugin';
import { DashboardPlugin } from '@liskhq/lisk-framework-dashboard-plugin';

export const registerPlugins = (app: Application): void => {

    app.registerPlugin(GetAllTypesPlugin);
    app.registerPlugin(HTTPAPIPlugin);
    app.registerPlugin(DashboardPlugin);
    app.registerPlugin(FaucetPlugin);
};
