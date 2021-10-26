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

async function* get_data(binding: KV.Namespace, prefix: string) {
	const keys = await paginate(binding, {
		prefix,
	});

	for await (let key of keys) {
		yield await read(binding, key);
	}
}

const handler: Handler<Context> = async (_request, context) => {
	const { pipe, response } = Piecemeal.stream(
		get_data(context.bindings.DATA, 'something'),
		{
			headers: {
				'cache-control': 'public,max-age=50',
			},
		},
	);

	context.waitUntil(pipe());

	return response;
};

const API = new Router();
API.add('GET', '/', handler);

export default reply(API.run);
