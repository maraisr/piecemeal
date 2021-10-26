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

		let payload: any = data,
			headers;
		let dtype = typeof data;

		if (data === null) payload = '';
		else if (dtype === 'object') {
			if (is_raw(data)) {
				headers = data.headers;
				payload = data.data;
			} else {
				headers = { [CONTENT_TYPE]: 'application/json;charset=utf-8' };
				payload = JSON.stringify(data);
			}
		} else if (dtype !== 'string') {
			payload = String(data);
		}

		headers = headers || { [CONTENT_TYPE]: 'text/plain' };

		await write(message(payload, headers) + `--${boundary}`);
	}

	write(`--\r\n`);
};
