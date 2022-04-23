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
 * TODO
 */
export async function generate<T extends any>(
	iterator: AsyncIterableIterator<T> | IterableIterator<T>,
	boundary: string,
	write: (chunk: string) => Promise<any> | any,
	abort?: Abortable,
): Promise<void>;
