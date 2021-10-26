import type { Abortable, Headers, Payload } from './types';

export type { Payload, Options } from './types';

const CONTENT_TYPE = /*#__PURE__*/ 'content-type';

export const message = (payload: any, headers: Headers) => {
	const returns = [''];

	for (let key in headers) returns.push(`${key}: ${headers[key]}`);

	returns.push('', String(payload), '');

	return returns.join('\r\n');
};

/*#__INLINE__*/
const is_raw = (data: any): data is Payload<any> =>
	'headers' in data && 'data' in data;

export const generate = async <T extends any>(
	iterator: AsyncIterableIterator<T> | IterableIterator<T>,
	boundary: string,
	write: (chunk: string) => Promise<any> | any,
	abort?: Abortable,
) => {
	await write(`--${boundary}`);

	for await (let data of iterator) {
		if (abort && abort.aborted) break;

		let payload, headers;

		if (is_raw(data)) {
			payload = data.data;
			headers = data.headers;
		} else {
			let dtype = typeof data;
			let ctype;

			if (data === null) payload = '';
			else if (dtype === 'object') {
				ctype = 'application/json;charset=utf-8';
				payload = JSON.stringify(data);
			} else if (dtype !== 'string') {
				payload = String(data);
			}

			ctype = ctype || 'text/plain';
			headers = { [CONTENT_TYPE]: ctype };
		}

		await write(message(payload, headers) + `--${boundary}`);
	}

	write(`--\r\n`);
};
