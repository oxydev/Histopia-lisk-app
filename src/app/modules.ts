/* eslint-disable @typescript-eslint/no-empty-function */
import { Application } from 'lisk-sdk';
import { BridgeModule } from "./modules/bridge/bridge_module";
import { FoeModule } from "./modules/foe/foe_module";
import { HistopianftModule } from "./modules/histopianft/histopianft_module";


export const registerModules = (app: Application): void => {
    app.registerModule(HistopianftModule);
    app.registerModule(FoeModule);
    app.registerModule(BridgeModule);
};
