import type { Options } from 'piecemeal';

/**
 * Streams an iterable to a {@link Response} for service workers, and works
 * within {@link https://workers.cloudflare.com/|Cloudflare Workers}.
 *
 * Returns a pipe method you can you use to async run the iterator, not blocking
 * the response. Due to the nature of {@link https://developer.mozilla.org/en-US/docs/Web/API|WebAPI}'s,
 * the {@link Response} must be created inside. Therefore there is a
 * responseInit argument to set other response properties.
 *
 * @example
 *
 * ```ts
 * const data = iterable();
 *
 * const { response, pipe } = stream(
 *   data,
 *   { status: 418 },
 *   { boundary: '-' }
 * );
 *
 * nonBlocking(pipe());
 *
 * return response;
 * ```
 *
 * @example Cloudflare Workers
 *
 * ```ts
 * export default {
 *   fetch(res, env, ctx) {
 *    const data = iterable(env.KV_MAYBE);
 *
 *    const { response, pipe } = stream(data);
 *
 *    ctx.waitUntil(pipe());
 *
 *    return response;
 *   }
 * }
 * ```
 */
export function stream<T extends any>(
	data: AsyncIterableIterator<T> | IterableIterator<T>,
	responseInit?: ResponseInit,
	options?: Options,
): {
	response: Response;
	pipe(): Promise<void>;
};
