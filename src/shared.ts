export type Options = {
	boundary?: string;
};

export async function* mapTo<I, R>(
	iterator: AsyncIterableIterator<I> | IterableIterator<I>,
	map: (value: I) => R,
) {
	for await (let i of iterator) yield map(i);
}
