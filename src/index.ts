import type { Abortable, Headers, Payload } from 'piecemeal';

/*#__INLINE__*/
function message(payload: any, headers: Headers) {
	const returns = [''];

	for (let key in headers) returns.push(`${key}: ${headers[key]}`);

	returns.push('', String(payload), '');

	return returns.join('\r\n');
}

/*#__INLINE__*/
function is_raw(data: any): data is Payload<any> {
	return 'headers' in data && 'data' in data;
}

export async function generate<T extends any>(
	iterator: AsyncIterableIterator<T> | IterableIterator<T>,
	boundary: string,
	write: (chunk: string) => Promise<any> | any,
	abort?: Abortable,
) {
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
				headers = { 'content-type': 'application/json;charset=utf-8' };
				payload = JSON.stringify(data);
			}
		} else if (dtype !== 'string') {
			payload = String(data);
		}

		headers = headers || { 'content-type': 'text/plain' };

		await write(message(payload, headers) + `--${boundary}`);
	}

	await write(`--\r\n`);
}
