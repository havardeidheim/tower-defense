const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const isWatch = args.includes('--watch');

// Copy index.html to dist
const srcIndex = path.join(__dirname, 'src', 'index.html');
const distIndex = path.join(__dirname, 'dist', 'index.html');
fs.mkdirSync(path.dirname(distIndex), { recursive: true });
fs.copyFileSync(srcIndex, distIndex);
console.log('Copied index.html to dist/');

// Copy public assets to dist
function copyDir(src, dest) {
    if (!fs.existsSync(src)) return;
    fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

copyDir(path.join(__dirname, 'public'), path.join(__dirname, 'dist'));
console.log('Copied public/ assets to dist/');

const buildOptions = {
    entryPoints: ['src/game/main.ts'],
    bundle: true,
    outfile: 'dist/bundle.js',
    sourcemap: isWatch,
    minify: !isWatch,
    logLevel: 'info',
};

if (isWatch) {
    esbuild.context(buildOptions).then(ctx => {
        ctx.watch();
        ctx.serve({ servedir: 'dist', port: 8080 }).then(({ host, port }) => {
            console.log(`Dev server running at http://localhost:${port}`);
        });
    });
} else {
    esbuild.build(buildOptions).then(() => {
        console.log('Build complete!');
    });
}
