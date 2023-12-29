import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import {nodePolyfills} from "vite-plugin-node-polyfills";
import pluginChecker from 'vite-plugin-checker'
import {VitePWA, VitePWAOptions} from "vite-plugin-pwa";

const baseUrl = "/app/planrun";

const manifestForPlugIn: Partial<VitePWAOptions> = {
    registerType: 'autoUpdate',
    manifest: {
        name: "PLANRUN",
        short_name: "planrun",
        description: "A running planner",
        icons: [
            {
                src: `${baseUrl}/android-chrome-192x192.png`,
                sizes: '192x192',
                type: 'image/png',
                purpose: 'favicon'
            },
            {
                src: `${baseUrl}/android-chrome-512x512.png`,
                sizes: '512x512',
                type: 'image/png',
                purpose: 'favicon'
            },
            {
                src: `${baseUrl}/apple-touch-icon.png`,
                sizes: '180x180',
                type: 'image/png',
                purpose: 'apple touch icon',
            }
        ],
        theme_color: '#6c6df2',
        background_color: '#ffffff',
        display: "standalone",
        scope: `${baseUrl}`,
        start_url: `${baseUrl}`,
        orientation: 'portrait'
    }
}

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        host: '0.0.0.0',
        port: 5010
    },
    plugins: [
        pluginChecker({typescript: true}),
        react(),
        nodePolyfills(),
        VitePWA(manifestForPlugIn)
    ],
    resolve: {
        alias: [
            {find: "@", replacement: path.resolve(__dirname, "src")},
        ]
    }
});
