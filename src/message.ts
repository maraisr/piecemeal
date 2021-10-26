import type { Payload } from 'piecemeal';

import type { Headers } from './types';

/*#__INLINE__*/
export const raw = <T extends any>(data: T, headers?: Headers): Payload<T> => ({
	data,
	headers,
});
