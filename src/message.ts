import type { Payload } from 'piecemeal';

import type { Headers } from './types';

export const raw = <T extends any>(data: T, headers?: Headers): Payload<T> => ({
	data,
	headers,
});
