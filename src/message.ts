import type { Payload } from 'piecemeal';

export const json = (data: any): Payload<string> => ({
	payload: JSON.stringify(data),
	headers: {
		'content-type': 'application/json;charset=utf-8',
	},
});
