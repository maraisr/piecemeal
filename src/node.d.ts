import type { ServerResponse } from 'http';

import type { Options } from 'piecemeal';

/**
 * Streams an iterable to a {@link ServerResponse} for a node runtime.
 *
 * Returns a pipe method you can you use to async run the iterator, not blocking
 * the response.
 *
 * @example
 *
 * ```ts
 * const data = iterable();
 *
 * const { pipe } = stream(
 *   data,
 *   { status: 418 },
 *   { boundary: '-' }
 * );
 *
 * nonBlocking(
 *   pipe(res)
 * );
 * ```
 * ```
 */
export function stream<T extends any>(
	data: AsyncIterableIterator<T> | IterableIterator<T>,
	options?: Options,
): {
	pipe(res: ServerResponse): Promise<void>;
};
