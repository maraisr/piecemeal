import * as message from 'piecemeal/message';
import * as Piecemeal from 'piecemeal/worker';
import { Context as ModuleContext, Handler, Router } from 'worktop';
import { reply } from 'worktop/cache';
import type { KV } from 'worktop/kv';
import { paginate, read } from 'worktop/kv';

interface Context extends ModuleContext {
	bindings: {
		DATA: KV.Namespace;
	};
}

async function* get_data_kv(binding: KV.Namespace, prefix: string) {
	const keys = await paginate(binding, {
		prefix,
	});

	for await (let key of keys) {
		yield message.json(await read(binding, key));
	}
}

async function* get_data_static() {
	for (let letter = 65; letter <= 90; letter++) {
		// Artificial pause
		await new Promise((resolve) => setTimeout(resolve, 150));

		yield message.json({ letter: String.fromCharCode(letter) });
	}
}

const handler: Handler<Context> = async (_request, context) => {
	const { pipe, response } = Piecemeal.stream(get_data_static(), {
		headers: {
			'cache-control': 'public,max-age=50',
		},
	});

	context.waitUntil(pipe());

	return response;
};

const API = new Router();
API.add('GET', '/', handler);

export default reply(API.run);
