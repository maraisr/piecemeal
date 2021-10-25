import * as Piecemeal from 'piecemeal/node';
import type { Middleware } from 'polka';
import polka from 'polka';

const db = {
	async fetchAllKeys() {
		return [1, 2, 3];
	},
	async read(key) {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve(`The key for ${key}`);
			}, 200);
		});
	},
};

async function* get_data() {
	const keys = await db.fetchAllKeys();

	for await (let key of keys) {
		yield await db.read(key);
	}
}

const handler: Middleware = async (_req, res) => {
	const stream = Piecemeal.stream(get_data());

	await stream.pipe(res);
};

polka().get('/', handler).listen(8080);
