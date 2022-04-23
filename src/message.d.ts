import type { Payload, Headers } from 'piecemeal';

/**
 * A helper method to create the right payload to flush headers and body in an
 * incrementl payload.
 *
 * @example
 *
 * ```ts
 * function* iterable() {
 *    yield raw("hello world", { 'content-type: 'text/plain' });
 * }
 * ```
 */
export function raw<T extends any>(data: T, headers?: Headers): Payload<T>;
