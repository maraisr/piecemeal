import type { ServerResponse } from 'http';
import { generate } from '.';
import type { Options } from './shared';
import { mapTo } from './shared';

// TODO: Only supports json right now
const headers = {
	'content-type': 'application/json; charset=utf-8',
};

export const stream = <T extends any>(
	data: AsyncIterableIterator<T> | IterableIterator<T>,
	options: Options = {},
) => {
	const boundary = options.boundary || '-';

	const pipe = async (res: ServerResponse) => {
		res.setHeader('connection', 'keep-alive');
		res.setHeader(
			'content-type',
			`multipart/mixed; boundary="${boundary}"`,
		);
		res.setHeader('transfer-encoding', 'chunked');

		let ended = false;
		res.once('close', () => (ended = true));

		await generate(
			mapTo(data, (payload) => ({ payload, headers })),
			boundary,
			res.write,
			{
				get aborted() {
					return ended;
				},
			},
		);

		res.end();
	};

	return {
		pipe,
	};
};
