// @ts-check
import dts from "rollup-plugin-dts";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { transpileModule } from "typescript";
import tsconfig from "./tsconfig.json";
import pkg from "./package.json";

/**
 * @param {boolean} isESM
 * @param {string} key
 * @returns {import("rollup").OutputOptions}
 */
const output = (isESM, key) => {
	return {
		format: isESM ? "esm" : "cjs",
		file: pkg.exports[key][isESM ? "import" : "require"] ?? pkg.exports[key],
		preferConst: true,
		esModule: false,
		freeze: false,
		strict: true,
	};
};

/**
 * @returns {import("rollup").RollupOptions}
 */
const source = (input, output) => ({
	input,
	output,
	context: "./src",
	external: [
		/worktop\/?.*/,
		/piecemeal\/?.*/
	],
	plugins: [
		nodeResolve({
			extensions: [".ts", ".d.ts"],
		}),
		{
			name: "typescript",
			transform(code, file) {
				if (/\.d\.ts$/.test(file)) return "";
				if (!/\.ts$/.test(file)) return code;
				// @ts-ignore
				let output = transpileModule(code, {
					...tsconfig, fileName: file,
				});
				return {
					code: output.outputText,
					map: output.sourceMapText || null,
				};
			},
		},
	],
});

/**
 * @returns {import("rollup").RollupOptions}
 */
const types = (input, file) => ({
	input,
	output: {
		file,
		format: "esm",
	},
	plugins: [
		dts(),
	],
});

// Multiple Rollup configs
export default [
	types("src/index.ts", "types/index.d.ts"),
	types("src/node.ts", "types/node.d.ts"),
	types("src/worker.ts", "types/worker.d.ts"),
	source("src/index.ts", [
		output(true, "."),
		output(false, "."),
	]),
	source("src/worker.ts", [
		output(true, "./worker"),
	]),
	source("src/node.ts", [
		output(true, "./node"),
		output(false, "./node"),
	]),
];
