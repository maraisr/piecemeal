import type { ServerResponse } from 'http';

import type { Options } from 'piecemeal';

/**
 * TODO
 */
export function stream<T extends any>(
	data: AsyncIterableIterator<T> | IterableIterator<T>,
	options?: Options,
): {
	pipe(res: ServerResponse): Promise<void>;
};
