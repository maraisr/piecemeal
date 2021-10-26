import * as Piecemeal from 'piecemeal/worker';
import { Context as ModuleContext, Handler, Router } from 'worktop';
import { reply } from 'worktop/cache';

import { send } from 'worktop/response';

async function* get_data() {
	for (let letter = 65; letter <= 90; letter++) {
		// Purely to illustrate an artifical wait
		await new Promise((resolve) => setTimeout(resolve, 150));

		yield { letter: String.fromCharCode(letter) };
	}
}

const handler: Handler = async (_request, context) => {
	const { pipe, response } = Piecemeal.stream(
		get_data(),
		{
			headers: {
				'cache-control': 'public,max-age=50',
			},
		},
	);

	context.waitUntil(pipe());

	return response;
};

const API = new Router();
API.add('GET', '/data', handler);
API.add('GET', '/', () => {

	return send(200, `<!DOCTYPE html>
<html lang='en'>
<head>
	<link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
	<style>
	html { font-family: 'Inter', sans-serif; }
	@supports (font-variation-settings: normal) {
		html { font-family: 'Inter var', sans-serif; }
	}
	body {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 2rem;
		justify-content: center;
	}

	body div {
		padding: 1rem;
		background-color: bisque;
		border-radius: 0.5rem;

		animation: fade ease 1s;
		animation-iteration-count: 1;
		animation-fill-mode: forwards;
	}

	@keyframes fade {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		 }
	}
	</style>
</head>
<script type='module'>
	import { meros } from 'https://cdn.skypack.dev/meros';

	const parts = await fetch('/data').then(meros);

	for await (let part of parts) {
		const el = document.createElement('div');
		el.innerText = part.body.letter;
		document.body.appendChild(el);
	}
</script>
</html>	
`, {
		'content-type': 'text/html',
		'cache-control': 'public,max-age=1000'
	})

});

export default reply(API.run);
