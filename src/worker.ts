import * as Buffer from 'worktop/buffer';
import { generate } from '.';
import type { Options } from './shared';
import { mapTo } from './shared';

// TODO: Only supports json right now
const headers = {
	'content-type': 'application/json; charset=utf-8',
};

export const stream = <T extends any>(
	data: AsyncIterableIterator<T> | IterableIterator<T>,
	requestInit: ResponseInit = {},
	options: Options = {},
) => {
	const { readable, writable } = new TransformStream();

	const boundary = options.boundary || '-';

	requestInit.headers = {
		...requestInit.headers,
		connection: 'keep-alive',
		'content-type': `multipart/mixed; boundary="${boundary}"`,
		'transfer-encoding': 'chunked',
	};

	const pipe = async () => {
		const writer = writable.getWriter();

		await generate(
			mapTo(data, (payload) => ({ payload, headers })),
			boundary,
			(data: string) => writer.write(Buffer.from(data)),
		);

		return writer.releaseLock();
	};

	return {
		response: new Response(readable, requestInit),
		pipe,
	};
};
