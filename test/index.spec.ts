import { test } from 'uvu';
import assert from 'uvu/assert';
import * as piecemeal from '../src';

test('exports', () => {
	assert.type(piecemeal, 'object');
	assert.type(piecemeal.message, 'function');
	assert.type(piecemeal.generate, 'function');
});

test.run();
