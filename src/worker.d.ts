import type { Options } from 'piecemeal';

/**
 * TODO
 */
export function stream<T extends any>(
	data: AsyncIterableIterator<T> | IterableIterator<T>,
	responseInit?: ResponseInit,
	options?: Options,
): {
	response: Response;
	pipe(): Promise<void>;
};
