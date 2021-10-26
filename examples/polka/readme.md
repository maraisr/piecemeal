# Example: Polka

This example demonstrates how to use `piecemeal` and have it generate a multipart response within a Polka app.

But really works with any server, put simply; this example shows how `piecemeal` can be used to generate multipart
responses, by simply supplying a `ServerResponse` instance.

## Getting started

_Setup_

```sh
npm install
```

_Start_

```sh
npm start
```

Running the above command will spin up a [`polka`](https://github.com/lukeed/polka) server, emitting multipart responses
on the root.

- [_localhost:8080_](http://localhost:8080/) — will respond with a multipart response.
