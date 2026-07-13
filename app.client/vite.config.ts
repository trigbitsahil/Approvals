import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import babel from "vite-plugin-babel";
import { VitePWA } from "vite-plugin-pwa";
import tailwindcss from "@tailwindcss/vite";
import legacy from "@vitejs/plugin-legacy";

const apiPlugin = () => ({
  name: 'api-plugin',
  config(config: any, envConfig: any) {
    const env = loadEnv(envConfig.mode, process.cwd(), '');
    process.env = { ...process.env, ...env };
  },
  configureServer(server: any) {
    server.middlewares.use(async (req: any, res: any, next: any) => {
      if (req.url === '/api/chat' && req.method === 'POST') {
        try {
          // Let Vite handle transpilation and module resolution of the route file
          const { POST } = await server.ssrLoadModule('/src/app/api/chat/route.ts');
          
          const protocol = req.headers['x-forwarded-proto'] || 'http';
          const host = req.headers.host || 'localhost';
          const url = new URL(req.url, `${protocol}://${host}`);
          
          const buffers = [];
          for await (const chunk of req) {
            buffers.push(chunk);
          }
          const body = Buffer.concat(buffers);
          
          const webReq = new Request(url.href, {
            method: req.method,
            headers: new Headers(req.headers as any),
            body: body.length > 0 ? body : null,
          });
          
          const webRes = await POST(webReq);
          
          res.statusCode = webRes.status;
          webRes.headers.forEach((value: string, key: string) => {
            res.setHeader(key, value);
          });
          
          if (webRes.body) {
            const reader = webRes.body.getReader();
            const push = async () => {
              while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                res.write(value);
              }
              res.end();
            };
            push().catch((err) => {
              console.error('Stream Error:', err);
              res.end();
            });
          } else {
            res.end();
          }
        } catch (error: any) {
          console.error('API Route Error:', error);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: error.message }));
        }
      } else {
        next();
      }
    });
  }
});

export default defineConfig({
  plugins: [
    react(),
    babel({
      babelConfig: { babelrc: true },
    }),
    tailwindcss(),
    legacy({
      targets: ["defaults", "iOS >= 12", "Safari >= 12"],
      additionalLegacyPolyfills: ["regenerator-runtime/runtime"],
    }),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      },
      includeAssets: ["favicon.svg", "robots.txt", "apple-touch-icon.png"],
      devOptions: {
        enabled: true,
        type: "module",
      },
      manifest: {
        name: "OOH",
        short_name: "OOH",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
    apiPlugin() // <--- Intercepts /api/chat and runs your route.ts seamlessly!
  ],

  build: {
    target: "es2015",
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
