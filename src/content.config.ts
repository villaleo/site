import { GreetingsLoaderSchema, NewsFeedLoaderSchema } from "./types";
import { newsfeedLoader } from "./newsfeed-loader";

import { defineCollection } from "astro:content";
import { file } from "astro/loaders";

const greetings = defineCollection({
    loader: file("src/data/greetings.json"),
    schema: GreetingsLoaderSchema,
});

const newsfeed = defineCollection({
    loader: newsfeedLoader(),
    schema: NewsFeedLoaderSchema,
});

export const collections = { greetings, newsfeed };
