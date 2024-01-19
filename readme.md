<div align="center">
	<h1><img src="./shots/logo.svg" alt="piecemeal"/></h1>
	<p><code>npm add piecemeal</code> makes incremental delivery possible</p>
	<hr />
	<div>
		<a href="https://github.com/maraisr/piecemeal/actions/workflows/ci.yml">
			<img src="https://github.com/maraisr/piecemeal/actions/workflows/ci.yml/badge.svg"/>
		</a>
		<a href="https://licenses.dev/npm/piecemeal">
		  <img src="https://licenses.dev/b/npm/piecemeal?style=dark" alt="licenses" />
		</a>
		<a href="https://npm-stat.com/charts.html?package=piecemeal">
			<img src="https://badgen.net/npm/dm/piecemeal?labelColor=black&color=black" alt="downloads"/>
		</a>
		<a href="https://packagephobia.com/result?p=piecemeal">
			<img src="https://badgen.net/packagephobia/install/piecemeal?labelColor=black&color=black" alt="size"/>
		</a>
		<a href="https://bundlephobia.com/result?p=piecemeal">
			<img src="https://badgen.net/bundlephobia/minzip/piecemeal?labelColor=black&color=black" alt="size"/>
		</a>
	</div>
</div>

## ⚡ Features

- **Lightweight** — _Does **not** include any dependencies [see](https://npm.anvaka.com/#/view/2d/piecemeal)_.

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
  // assumes JSON (can override)
  const stream = Piecemeal.stream(data);

  // Pipes the stream directly to a ServerResponse
  stream.pipe(res);
}).listen(8080);
```

## 🔎 API

#### Module: [`piecemeal/worker`](./src/worker.ts)

The main module used by [Cloudflare Workers](https://workers.cloudflare.com/) — or any
[Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API).

> Example over at [/examples/workers](/examples/workers)

#### Module: [`piecemeal/node`](./src/node.ts)

The main module used for a `node` runtime and plugs directly into `node:http` modules.

> Example over at [/examples/polka](/examples/polka)

#### Module: [`piecemeal/message`](./src/message.ts)

A module used to construct messages. Messages are the partial _bits-of-data_ flushed in increments.

#### Module: [`piecemeal`](./src/index.ts)

A main module one can use to build out custom runtimes — exposes all the building blocks to `generate` a stream
supplying the Iterable and a write method.

## 🙊 Caveats

- Workers doesn't abort any iterables if connection is dropped. 😔

## Related

- [meros](https://github.com/maraisr/meros) — makes reading multipart responses simple

## License

MIT © [Marais Rossouw](https://marais.io)
