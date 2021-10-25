import * as message from 'piecemeal/message';
import * as Piecemeal from 'piecemeal/node';
import type { Middleware } from 'polka';
import polka from 'polka';

const db = {
	async fetchAllKeys() {
		return [1, 2, 3];
	},
	async read(key: number) {
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
		yield message.json(await db.read(key));
	}
}

const handler: Middleware = async (_req, res) => {
	const stream = Piecemeal.stream(get_data());

	await stream.pipe(res);
};

polka({
	onError(e) {
		console.error(e);
	},
})
	.get('/', handler)
	.listen(8080, (e) => {
		if (e) throw e;
		console.log('Ready 🕺');
	});
