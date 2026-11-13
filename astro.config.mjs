import { defineConfig, fontProviders } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
    vite: {
        plugins: [tailwindcss()],
    },

    fonts: [
        {
            provider: fontProviders.fontsource(),
            name: "Silkscreen",
            cssVariable: "--font-silkscreen",
        },
        {
            provider: fontProviders.fontsource(),
            name: "UnifontEX",
            cssVariable: "--font-unifontex",
        },
        {
            provider: fontProviders.fontsource(),
            name: "Source Serif 4",
            cssVariable: "--font-source-serif",
        },
    ],

    adapter: cloudflare(),
});
