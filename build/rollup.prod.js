const fs = require("fs");
const path = require("path");
const babel = require("rollup-plugin-babel");
const flow = require("rollup-plugin-flow-no-whitespace");
const cjs = require("rollup-plugin-commonjs");
const node = require("rollup-plugin-node-resolve");
const eslint = require("rollup-plugin-eslint");
const replace = require("rollup-plugin-replace");
const postcss = require("rollup-plugin-postcss");
const simplevars = require("postcss-simple-vars");
const nested = require("postcss-nested");
const cssnext = require("postcss-cssnext");
const cssnano = require("cssnano");
const build = require("./build");
const version = process.env.VERSION || require("../package.json").version;

const fullPath = p => path.resolve(__dirname, "../", p);

const banner =
    "/*!\n" +
    "* easy-bar.js v" +
    version +
    "\n" +
    "* (c) 2018-" +
    new Date().getFullYear() +
    " PengYuan-Jiang\n" +
    "*/";

function genConfig(opts) {
    return {
        input: {
            input: fullPath("src/easy-bar.js"),
            plugins: [
                flow(),
                postcss({
                    plugins: [
                        simplevars(),
                        nested(),
                        cssnext({ warnForDuplicates: false }),
                        cssnano()
                    ],
                    extensions: [".css"]
                }),
                node(),
                eslint({
                    include: [fullPath("src/") + "**/*.js"] // 需要检查的部分
                }),
                cjs(),
                babel({
                    exclude: "node_modules/**"
                })
            ]
        },
        output: {
            file: opts.output,
            format: opts.format,
            name: "EasyBar",
            banner,
            min: opts.min
        }
    };
}

const builds = [
    {
        output: fullPath("dist/easy-bar.js"),
        format: "umd"
    },
    {
        output: fullPath("dist/easy-bar.min.js"),
        format: "umd",
        min: true
    },
    {
        output: fullPath("dist/easy-bar.common.js"),
        format: "cjs"
    },
    {
        output: fullPath("dist/easy-bar.esm.js"),
        format: "es"
    }
].map(genConfig);

var distDir = fullPath("dist/");
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
}
build(builds);
