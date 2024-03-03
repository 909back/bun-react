import { renderToReadableStream } from "react-dom/server"
import {App} from "./app"

const builds = await Bun.build({
  entrypoints: ['./app/index.tsx'],
  target: "browser",
  minify: {
    identifiers: true,
    syntax: true,
    whitespace: true,
  },
});

const indexFile = Bun.file('index.html')

/** only client side render */
const server = Bun.serve({
  port: 3000,
  fetch: async (req) => {
    const { pathname } = new URL(req.url);
    console.log(builds)
    if (pathname === "/index.js" && req.method === "GET") {
      return new Response(builds.outputs[0].stream(), {
        headers: {
          'Content-Type': builds.outputs[0].type,
        },
      });
    };

    if (pathname === "/" && req.method === "GET") {
      const indexContent = await indexFile.text();

      const contentWithReactScript = indexContent.replace(
        "<!-- react-script -->",
        `<script type="module" src="/index.js"></script>`,
      );

      return new Response(contentWithReactScript, {
        headers: {
          'Content-Type': 'text/html',
        },
      });
    }

    return new Response('Not Found', { status: 404 });
  },
});

/** only server side render */
// const server = Bun.serve({
//   port: 3000,
//   async fetch(req) {
//     const stream = await renderToReadableStream(<App />)
//     return new Response(stream, {
//       headers: { 'Content-Type': 'text/html' }
//     })
//   }
// })

console.log(`Test Project for SSR(%c✨Runing on ${server.port})`, `color: red;`)