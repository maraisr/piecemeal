import type { Options, Payload } from 'piecemeal';
import { generate } from 'piecemeal';

const Encoder = new TextEncoder();
const asUTF8 = (input: string) => Encoder.encode(input);

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
			writer.write(asUTF8(data)),
		);

		return writer.releaseLock();
	};

	return {
		response: new Response(readable, requestInit),
		pipe,
	};
};
