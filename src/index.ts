type Dict<T> = Record<string, T>;
type Headers = Dict<string | ReadonlyArray<string>>;

type Payload<T> = { payload: T; headers: Headers };
type Abortable = { aborted: boolean };

export const message = (payload: any, headers: Headers) => {
	const returns = [''];

	for (let key in headers) returns.push(`${key}: ${headers[key]}`);

	returns.push('', String(payload), '');

	return returns.join('\r\n');
};

export const generate = async <T extends Payload<any>>(
	iterator: AsyncIterableIterator<T> | IterableIterator<T>,
	boundary: string,
	write: (chunk: string) => Promise<any> | any,
	abort?: Abortable,
) => {
	await write(`--${boundary}`);

	for await (let part of iterator) {
		if (abort && abort.aborted) break;

		await write(message(part.payload, part.headers) + `--${boundary}`);
	}

	write(`--\r\n`);
};
