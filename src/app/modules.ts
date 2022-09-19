/* eslint-disable @typescript-eslint/no-empty-function */
import { Application } from 'lisk-sdk';
import { HistopianftModule } from "./modules/histopianft/histopianft_module";

// import { HistopiaNFTModule } from "../../old/histopia_n_f_t/histopia_n_f_t_module";

export const registerModules = (app: Application): void => {

    app.registerModule(HistopianftModule);
};
