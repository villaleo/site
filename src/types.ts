import { z } from "astro/zod";

export type NewsfeedItem = {
    guid: string;
    title: string;
    url: string;
    publicationDate: Date;
    description: string;
};

export const NewsFeedLoaderSchema = z.object({
    guid: z.string(),
    title: z.string(),
    url: z.url(),
    publicationDate: z.date(),
    description: z.string(),
});

export const GreetingsLoaderSchema = z.object({
    id: z.int(),
    msg: z.string(),
});
