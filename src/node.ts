import type { ServerResponse } from 'http';

import type { Options } from 'piecemeal';
import { generate } from 'piecemeal';

export const stream = <T extends any>(
	data: AsyncIterableIterator<T> | IterableIterator<T>,
	options: Options = {},
) => {
	const boundary = options.boundary || '-';

	const pipe = async (res: ServerResponse) => {
		res.setHeader('connection', 'keep-alive');
		res.setHeader('content-type', `multipart/mixed;boundary="${boundary}"`);
		res.setHeader('transfer-encoding', 'chunked');

		let ended = false;
		res.once('close', () => (ended = true));

		await generate(data, boundary, res.write.bind(res), {
			get aborted() {
				return ended;
			},
		});

		res.end();
	};

	return {
		pipe,
	};
};
