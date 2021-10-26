import { test } from 'uvu';
import assert from 'uvu/assert';
import * as piecemeal from '../src';

test('usage', async () => {
	async function* get_data() {
		yield 'a';
		yield 'b';
		yield 'c';
	}

	const parts: string[] = [];

	await piecemeal.generate(get_data(), '-', parts.push.bind(parts));

	assert.equal(parts, [
		'---',
		'\r\ncontent-type: text/plain\r\n\r\na\r\n---',
		'\r\ncontent-type: text/plain\r\n\r\nb\r\n---',
		'\r\ncontent-type: text/plain\r\n\r\nc\r\n---',
		'--\r\n',
	]);
});

test('payloads', async () => {
	async function* get_data() {
		yield { foo: 'bar' };
		yield 'text';
		yield {
			data: 'custom-data',
			headers: { 'x-test-header': 'value' },
		};
	}

	const parts: any[] = [];

	await piecemeal.generate(get_data(), '-', parts.push.bind(parts));

	// Validates that first is json, then, text then custom
	assert.equal(parts, [
		'---',
		'\r\ncontent-type: application/json;charset=utf-8\r\n\r\n{"foo":"bar"}\r\n---',
		'\r\ncontent-type: text/plain\r\n\r\ntext\r\n---',
		'\r\nx-test-header: value\r\n\r\ncustom-data\r\n---',
		'--\r\n',
	]);
});

// TOOD: Remove this async
test('sync iterable', async () => {
	function* get_data() {
		yield 1;
		yield 2;
		yield 3;
	}

	const parts: any[] = [];

	await piecemeal.generate(get_data(), '-', parts.push.bind(parts));

	assert.equal(parts, [
		'---',
		'\r\ncontent-type: text/plain\r\n\r\n1\r\n---',
		'\r\ncontent-type: text/plain\r\n\r\n2\r\n---',
		'\r\ncontent-type: text/plain\r\n\r\n3\r\n---',
		'--\r\n',
	]);
});

test('options~boundary', async () => {
	async function* get_data() {
		yield 'a';
		yield 'b';
		yield 'c';
	}

	const parts: string[] = [];

	await piecemeal.generate(get_data(), 'BOUNDARY', parts.push.bind(parts));

	assert.equal(parts, [
		'--BOUNDARY',
		'\r\ncontent-type: text/plain\r\n\r\na\r\n--BOUNDARY',
		'\r\ncontent-type: text/plain\r\n\r\nb\r\n--BOUNDARY',
		'\r\ncontent-type: text/plain\r\n\r\nc\r\n--BOUNDARY',
		'--\r\n',
	]);
});

test.run();
