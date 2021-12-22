import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import path from "path";
import ts from "rollup-plugin-typescript2";
export default {
	input: path.join(__dirname, "/index.ts"),
	output:[
		{
			name: "nodom",
			file: path.resolve("dist/nodom.esm.js"),
			format: "esm", 
			sourcemap: true, 
		},
		{
			name: "nodom",
			file: path.resolve("dist/nodom.cjs.js"), 
			format: "cjs",
			sourcemap: true, 
		},{
			name: "nodom",
			file: path.resolve("dist/nodom.global.js"),
			format: "iife", 
			sourcemap: true, 
		}
	] ,
	plugins: [
		nodeResolve({
			extensions: [".js", ".ts"],
		}),
		ts(),
		commonjs(),
	],
};
