import type { Options } from 'piecemeal';
import { generate } from 'piecemeal';

const Encoder = new TextEncoder();
const asUTF8 = (input: string) => Encoder.encode(input);

export function stream<T extends any>(
	data: AsyncIterableIterator<T> | IterableIterator<T>,
	responseInit: ResponseInit = {},
	options: Options = {},
) {
	const { readable, writable } = new TransformStream();

	const boundary = options.boundary || '-';

	responseInit.headers = {
		...(responseInit?.headers || {}),
		connection: 'keep-alive',
		'content-type': `multipart/mixed;boundary="${boundary}"`,
		'transfer-encoding': 'chunked',
	};

	async function pipe() {
		const writer = writable.getWriter();

		await generate(data, boundary, (data: string) =>
			writer.write(asUTF8(data)),
		);

		return writer.close();
	}

	return {
		response: new Response(readable, responseInit),
		pipe,
	};
}
