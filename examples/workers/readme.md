# Example: Workers

This example demonstrates how to use `piecemeal` and have it generate a multipart response.

The example does leverage [Workers KV](https://developers.cloudflare.com/workers/runtime-apis/kv);

> <details><summary>If this doesn't work for you, have a try with a static iterable:</summary>
>
> ```ts
> async function* get_data() {
>   // Prints the letters of the alphabet A -> Z
>   for (let letter = 65; letter <= 90; letter++) {
>     // Purely to illustrate an artifical wait
>     await new Promise((resolve) => setTimeout(resolve, 150));
>
>     yield { letter: String.fromCharCode(letter) };
>   }
> }
> ```
>
> </details>

## Getting started

_Setup_

```sh
npm install
```

_Start_

```sh
wrangler dev
```

> This setup does require `wrangler` — to setup head on over to
> [the docs](https://developers.cloudflare.com/workers/cli-wrangler/install-update)
