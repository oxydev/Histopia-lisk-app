import { BasePlugin, PluginInfo } from 'lisk-sdk';
import type { BaseChannel, EventsDefinition, ActionsDefinition, SchemaWithDefault } from 'lisk-sdk';

/* eslint-disable class-methods-use-this */
/* eslint-disable  @typescript-eslint/no-empty-function */
export class GetAllTypesPlugin extends BasePlugin {
	// private _channel!: BaseChannel;

	public static get alias(): string {
		return 'getAllTypes';
	}

	// eslint-disable-next-line @typescript-eslint/class-literal-property-style
	public static get info(): PluginInfo {
		return {
			author: 'atomaton00@gmail.com',
			version: '0.1.0',
			name: 'getAllTypes',
		};
	}

	// eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
	public get defaults(): SchemaWithDefault {
		return {
			$id: '/plugins/plugin-getAllTypes/config',
			type: 'object',
			properties: {
				enable: {
					type: 'boolean',
				},
			},
			required: [ 'enable'],
			default: {
				enable: true,
			},
		}
	}

	public get events(): EventsDefinition {
		return [
			// 'block:created',
			// 'block:missed'
		];
	}

	public get actions(): ActionsDefinition {
		return {
			// 	hello: async () => { hello: 'world' },
		};
	}

	public async load(_: BaseChannel): Promise<void> {
		// this._channel = channel;
		// this._channel.once('app:ready', () => {});
	}

	public async unload(): Promise<void> { }
}
