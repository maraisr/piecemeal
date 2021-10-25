export type Dict<T> = Record<string, T>;
export type Headers = Dict<string | ReadonlyArray<string>>;

export type Payload<T> = { payload: T; headers: Headers };
export type Abortable = { aborted: boolean };

export type Options = {
	boundary?: string;
};
