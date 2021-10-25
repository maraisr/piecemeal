import type { Options, Payload } from 'piecemeal';
import { generate } from 'piecemeal';
import * as Buffer from 'worktop/buffer';

export const stream = <T extends Payload<any>>(
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

		await generate(data, boundary, (data: string) =>
			writer.write(Buffer.from(data)),
		);

		return writer.releaseLock();
	};

	return {
		response: new Response(readable, requestInit),
		pipe,
	};
};
