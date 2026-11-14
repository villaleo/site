import { newsfeedLoader } from "./newsfeed-loader";

import { defineCollection } from "astro:content";
import { file } from "astro/loaders";
import { z } from "astro/zod";

const greetings = defineCollection({
    loader: file("src/data/greetings.json"),
    schema: z.object({
        id: z.int(),
        msg: z.string(),
    }),
});

const newsfeed = defineCollection({
    loader: newsfeedLoader(),
    schema: z.object({
        guid: z.string(),
        title: z.string(),
        url: z.url(),
    }),
});

export const collections = { greetings, newsfeed };
