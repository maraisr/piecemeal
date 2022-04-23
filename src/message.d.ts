import type { Payload, Headers } from 'piecemeal';

/**
 * TODO
 */
export function raw<T extends any>(data: T, headers?: Headers): Payload<T>;
