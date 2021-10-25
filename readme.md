<div align="center">
	<h1><img src="./shots/logo.png" alt="piecemeal"/></h1>
	<p align="center"><code>npm add piecemeal</code> makes incremental delivery possible</p>
	<hr />
	<span>
		<a href="https://github.com/maraisr/piecemeal/actions/workflows/ci.yml">
			<img src="https://github.com/maraisr/piecemeal/actions/workflows/ci.yml/badge.svg"/>
		</a>
		<a href="https://npm-stat.com/charts.html?package=piecemeal">
			<img src="https://badgen.net/npm/dm/piecemeal" alt="downloads"/>
		</a>
		<a href="https://packagephobia.com/result?p=piecemeal@next">
			<img src="https://badgen.net/packagephobia/install/piecemeal@next" alt="size"/>
		</a>
		<a href="https://bundlephobia.com/result?p=piecemeal@next">
			<img src="https://badgen.net/bundlephobia/minzip/piecemeal@next" alt="size"/>
		</a>
	</span>
</div>

## ⚡ Features

- **Lightweight** — _Only includes runtimes for Workers. [See](https://npm.anvaka.com/#/view/2d/piecemeal)_.

- **Familiar** — _plugs into any `node:http` or `workers` based environment._

- **Incredible DX** — _passing only an `AsyncIterable | Iterable`._

## ⚙️ Install

```sh
npm add piecemeal
```

## 🚀 Usage

> Visit [/examples](/examples) for more info!

#### _Workers_

```ts
import * as Piecemeal from 'piecemeal/worker';

// Some sort of data access
// ~> here we read from KV, but can be anything
async function* get_data(binding: KV.Namespace) {
  const list = await DATA.list();

  for await (let item of list.keys) {
    yield await DATA.get(item);
  }
}

// A handler you'd typically give a Module or Service Worker
const handler = (request, env, context) => {
  // Notice we're not awaiting or spreading this iterable
  const data = get_data(context.bindings.DATA);

  // Sets up our stream and constructs the Response
  const { pipe, response } = Piecemeal.stream(data);

  // Defers the execution of the iterable, so we respond super quick
  context.waitUntil(pipe());

  return response;
};
```

#### _Node_

```ts
import { createServer } from 'node:http';

import * as Piecemeal from 'piecemeal/node';

// An example of some method to retreive some database data
async function* get_data() {
  const keys = await db.fetchAllKeys();

  for await (let key of keys) {
    yield await db.read(key);
  }
}

createServer((req, res) => {
  // Notice we're not awaiting or spreading this iterable
  const data = get_data();

  // Creates a streams — and kicks off the iterable.
  // assumes JSON (can ovveride)
  const stream = Piecemeal.stream(data);

  // Pipes the stream directly to a ServerResponse
  stream.pipe(res);
}).listen(8080);
```

## 🔎 API

#### Module: [`piecemeal`](./src/index.ts)

TODO

#### Module: [`piecemeal/message`](./src/message.ts)

TODO

#### Module: [`piecemeal/worker`](./src/worker.ts)

TODO

#### Module: [`piecemeal/node`](./src/node.ts)

TODO

## 🙊 Caveats

- Workers doesn't abort iterable if connection is dropped. 😔
- More..?? TODO

## Related

- [meros](https://github.com/maraisr/meros) — makes reading multipart responses simple

## License

MIT © [Marais Rossouw](https://marais.io)
