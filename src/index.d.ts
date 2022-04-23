type Dict<T> = Record<string, T>;

/**
 * @internal
 */
export type Abortable = { aborted: boolean };

export type Headers = Dict<string | ReadonlyArray<string>>;
export type Payload<T> = { data: T; headers: Headers };

export type Options = {
	boundary?: string;
};

/**
 * Passing the iterable, a boundary and a write method — this function allows
 * you to build out custom runtimes. Each `write` call is expect to flush
 * something to a transport.
 *
 * Note! You are expected to send the correct headers.
 *
 * ```plain
 * connection: keep-alive
 * content-type: multipart/mixed;boundary="<boundary>"
 * transfer-encoding: chunked
 * ```
 *
 * @example
 *
 * ```ts
 * const data = iterable();
 * const boundary = '-';
 *
 * res.setHeaders({
 *   connection: 'keep-alive',
 *   'content-type': `multipart/mixed;boundary="${boundary}"`,
 *   'transfer-encoding': 'chunked',
 * });
 *
 * generate(
 *   data,
 *   boundary,
 *   chunk => res.write(chunk)
 * );
 *
 * res.end();
 * ```
 *
 * ---
 *
 * There is also a 4th argument that can abort the looping, and _loosly_
 * implements the {@link AbortController} api. But only the `aborted: boolean`
 * property is required.
 *
 * @example
 *
 * ```ts
 * const abortSignal = new AbortController();
 *
 * generate(
 *    data,
 *    boundary,
 *    writer,
 *    abortSignal.signal
 * );
 *
 * // client canceled?
 * abortSignal.abort();
 *
 * // generate will now cease.
 * ```
 */
export async function generate<T extends any>(
	iterator: AsyncIterableIterator<T> | IterableIterator<T>,
	boundary: string,
	write: (chunk: string) => Promise<any> | any,
	abort?: Abortable,
): Promise<void>;
