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

export const collections = { greetings };
