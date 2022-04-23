import type { Payload, Headers } from 'piecemeal';

/*#__INLINE__*/
export const raw = <T extends any>(
	data: T,
	headers: Headers = {},
): Payload<T> => ({
	data,
	headers,
});
